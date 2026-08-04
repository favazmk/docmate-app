# DocMate — UAE Doctor Booking Platform 🏥

Patients search for specialists across Dubai, Sharjah and Ajman, browse hospital
networks and their branches, and request appointments. A clinic coordinator then
calls the patient back to confirm the exact time — the platform books *requests*,
not confirmed slots.

---

## 1. Live environments

| Environment | URL | Hosting | Deploys from |
|---|---|---|---|
| **Production** | https://docmate.ae | Hostinger Web Apps (Node 22) | GitHub `master`, automatic |

**Deploying = pushing to `master`.** Hostinger rebuilds on its own and takes about
2½ minutes. There is no manual deploy step.

There is **one** database and no staging environment — the admin panel edits
production data directly. Test schema changes against a local MySQL instance
first (see section 3).

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router), React, TypeScript |
| Styling | Tailwind CSS |
| Database | MySQL 11.8 (MariaDB) on Hostinger |
| ORM | Prisma 6 |
| Auth | NextAuth v4 — JWT sessions, Credentials provider, bcryptjs |
| Email | Nodemailer over Hostinger SMTP |
| Images | `next/image` with a remote allowlist in `next.config.mjs` |

---

## 3. Local setup

```bash
npm install
cp .env.example .env      # then fill in the values — see section 4
npx prisma generate
npm run dev
```

Open http://localhost:3000.

> ⚠️ **Do not run `npx prisma db push` or `prisma migrate` against the production
> database.** It is live and holds real client data. Point `DATABASE_URL` at a
> local or scratch MySQL instance first.

To populate a fresh scratch database:

```bash
node prisma/seed.js        # sample hospitals, clinics, doctors
node prisma/add-admin.js   # creates an admin user
```

---

## 4. Environment variables

| Variable | Production value | Notes |
|---|---|---|
| `DATABASE_URL` | `mysql://u785953539_docmate_admin:PASSWORD@localhost:3306/u785953539_docmate_datab` | **Host differs by environment — see below** |
| `NEXTAUTH_URL` | `https://docmate.ae` | Must match the real origin or login breaks |
| `NEXTAUTH_SECRET` | *(secret)* | JWT signing key |
| `SMTP_HOST` | `smtp.hostinger.com` | |
| `SMTP_PORT` | `465` | SSL |
| `SMTP_USER` | `info@docmate.ae` | Must be a real mailbox, never an alias |
| `SMTP_PASS` | *(mailbox password)* | |
| `ADMIN_EMAIL` | `admin@docmate.ae` | Where booking alerts land |
| `UPLOADS_DIR` | `/home/u785953539/docmate-uploads` | Outside the deploy folder so uploads survive redeploys |

### 4.1 `DATABASE_URL` host — the thing that catches everyone

The host depends on **where the code runs**:

| Runs on | Host |
|---|---|
| Hostinger (docmate.ae) | `localhost:3306` — app and MySQL share a machine |
| Your laptop, or any other host | `srv346.hstgr.io:3306` |

Same username, password and database name — only the host changes. Using
`localhost` from anywhere other than the Hostinger server produces
`PrismaClientInitializationError: Can't reach database server at localhost:3306`,
and because the page-level data fetches are wrapped in `try/catch`, **pages render
empty instead of showing an error.** Silent blank lists almost always mean this.

Connecting from outside also requires a Remote MySQL rule in hPanel → Databases
(see the security note in section 9).

### 4.2 Hostinger's env var panel — three traps

1. **Value only.** The field takes `smtp.hostinger.com`, *not*
   `SMTP_HOST=smtp.hostinger.com`, and no quotes.
2. **Never use `#` in a value.** Hostinger stores these in a `.env`-style file
   where `#` starts a comment, so it gets escaped to `\#` and arrives one
   character longer than you typed. This silently broke SMTP auth for hours.
   Safe punctuation: `-` `_` `.`
3. **Values are masked and case-sensitive.** A wrong capital letter is invisible
   in the panel. Verify by behaviour, not by looking.

Saving any variable triggers an automatic redeploy (~2½ min). No restart needed.

---

## 5. Data model

```
HospitalGroup ──< Clinic ──< (many-to-many) >── Doctor ──< Appointment
                                                    └──< Review
Specialty      (standalone catalogue used for filters)
User           (PATIENT | ADMIN)
```

Notes that are not obvious from the schema:

- **`Doctor.type` is a free-text `String`**, not an enum — currently
  `General Physician`, `Specialist`, `Consultant`. Renaming a value means updating
  both the dropdown **and** the known-value whitelist in
  `app/admin/doctors/DoctorsClient.tsx`, or saved records fall through to
  "Other (Custom)".
- **`photoUrl` holds a comma-separated list** for multi-image records. Anywhere a
  single thumbnail is shown you must use `photoUrl.split(",")[0].trim()`. Galleries
  split on the whole string.
- **Hospital groups with no clinic branches are invisible** in the Add-Doctor
  dropdown — that list is derived from clinics, not from hospitals.
- **The clinic City dropdown only offers Dubai, Sharjah and Ajman.** Other emirates
  need a code change in `app/admin/clinics/ClinicsClient.tsx`.
- Placeholder avatars come from `ui-avatars.com` and **must** include
  `&format=png`. That service now defaults to SVG, which `next/image` refuses
  unless `dangerouslyAllowSVG` is on.

---

## 6. Email

One real mailbox, one alias:

| Address | Type | Purpose |
|---|---|---|
| `info@docmate.ae` | **mailbox** | Sends all outgoing mail; shown publicly on the Contact page |
| `admin@docmate.ae` | **alias → info@** | Receives booking alerts and contact-form messages |

> An alias has no password of its own, so it can only ever **receive**.
> `SMTP_USER` must be the real mailbox.

A booking sends three emails (`lib/email.ts`):

1. Confirmation → the patient
2. Notification → the clinic (`Clinic.email`, falling back to `Doctor.email`)
3. Alert → `ADMIN_EMAIL`

⚠️ Email 2 is **skipped silently** if the clinic has no email address. Check with:

```sql
SELECT name, email FROM Clinic WHERE email IS NULL OR email = '';
```

DNS (MX, SPF, DKIM, DMARC) is already configured on the Hostinger zone and needs
no maintenance.

---

## 7. Admin panel

Sign in at **/admin/login**. Admin accounts are `User` rows with `role = 'ADMIN'`.

Passwords are bcrypt-hashed and cannot be recovered — only reset:

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_NEW_PASSWORD', 10))"
```

```sql
UPDATE User SET password = '<paste the hash>' WHERE email = 'admin@docmate.ae';
```

Authorisation happens in two places, and **both** matter:

- `middleware.ts` guards the `/admin/*` and `/dashboard/*` **page routes**
- `requireAdmin()` at the top of every mutating server action in
  `app/actions/admin.ts` and `app/actions/doctors.ts`

Server actions are publicly reachable POST endpoints. Middleware alone does not
protect them. **Any new admin action must call `requireAdmin()` as its first
line.**

---

## 8. Operational gotchas

**Changing the site's main domain requires a fresh deploy.** It moves the vhost
root to a new empty folder; existing deployments get re-tagged but do not re-run,
so the domain serves Hostinger's PHP placeholder and intermittent 503s. A restart
does not fix it — only a new build does. Editing any env var is the easiest way to
trigger one.

**Uploads live outside the deploy folder.** `UPLOADS_DIR` points at
`/home/u785953539/docmate-uploads`; each deploy lands in a new
`.builds/versions/<uuid>/` directory, so anything inside the project folder is
lost on redeploy. `app/api/uploads/[filename]/route.ts` serves from `UPLOADS_DIR`
first and falls back to the bundled `public/uploads`.

**Runtime logs are only in hPanel** → your website → **Runtime logs**. The
Hostinger API exposes build and deployment logs but not runtime output. This is
where `console.error` from server actions appears, and it is usually the fastest
route to a real answer.

---

## 9. Known issues / backlog

| Priority | Item |
|---|---|
| 🔴 High | **Remote MySQL is open to `%`** — any IP on the internet may attempt to connect, with only the password in the way. The production app connects over `localhost` and does not need this rule at all. Remove it in hPanel → Databases → Remote MySQL, and re-add your own IP temporarily whenever you need external access (phpMyAdmin in hPanel keeps working either way). |
| 🔴 High | **`createReview` requires no authentication** (`app/actions/reviews.ts`) — anyone can post reviews and move doctor ratings. Should require a logged-in user, ideally one with a past appointment. |
| 🟠 Medium | **No rate limiting anywhere.** `submitContact`, `submitClinicRequest`, `createAppointment` and `createReview` can be scripted. `getAppointmentsByEmailAndPhone` returns patient data for any email+phone pair and is brute-forceable. |
| 🟠 Medium | **Every public page is `force-dynamic`**, so each click re-queries the database — this is the navigation lag. Public pages could use `export const revalidate = 300` instead; the admin actions already call `revalidatePath()`, so edits would still appear immediately. |
| 🟠 Medium | **No indexes on filter columns.** `Doctor.status`, `Doctor.specialty` and `Clinic.city` are unindexed. See `db-indexes.sql`. |
| 🟡 Low | Three clinics use the placeholder email `info@clinic.com`, a domain owned by someone else. Booking emails containing patient names and phone numbers are delivered there. |
| 🟡 Low | `/search` ships a ~200 KB payload. |
| 🟡 Low | `prisma/seed.js` and `scripts/import-doctors.js` still contain demo data and placeholder phone numbers. |

---

## 10. Handover checklist

**Rotate — everything below was shared during development:**

- [ ] MySQL password for `u785953539_docmate_admin`, then update `DATABASE_URL` in hPanel
- [ ] `info@docmate.ae` mailbox password, then update `SMTP_PASS`
- [ ] Admin panel password (section 7)
- [ ] `NEXTAUTH_SECRET` — regenerate with `openssl rand -base64 32` (this signs out all users)
- [ ] Revoke the Hostinger API token used by tooling
- [ ] Revoke the old Gmail App Password on `teamwebbranding@gmail.com`

> ⚠️ Rotating the MySQL password takes the site down until `DATABASE_URL` is
> updated. Order: change password → update `DATABASE_URL` in hPanel → wait for
> the automatic redeploy → verify the site loads.

**Restrict:**

- [ ] Change Remote MySQL from `%` to specific IPs (hPanel → Databases → Remote MySQL)

**Transfer:**

- [ ] Hostinger account ownership, or create a client-owned account
- [ ] GitHub repository ownership
- [ ] Domain `docmate.ae` at the registrar (Tasjeel)
- [ ] Delete the temporary Vercel preview project (`docmate-app`) — it was only used to show the client work in progress and is not part of the live setup

**Clean up:**

- [ ] Delete the old company database `u775843128_docmate_db` (data was merged into production on 2026-08-04 — keep the backup until roughly 2026-09-01)
- [ ] Delete the orphaned `docmate.ae` DNS zone in the old company Hostinger account
- [ ] Remove test records: doctors with slugs `test-*` / `tester-*`, and the `testing` clinic
- [ ] Replace the three `info@clinic.com` clinic addresses with real ones

**Verify after handover:**

- [ ] Make a test booking and confirm all three emails arrive
- [ ] Log into `/admin` and edit a doctor
- [ ] Upload a photo, redeploy, confirm the photo still loads
