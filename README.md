# Docmate - Dubai Doctor Booking Platform 🏥

## 🔗 Live Link

*No live deployment link configured yet.*

## 📸 Screenshots

![Docmate Dashboard](./public/assets/screenshot.png)

## 📝 Project Description

Docmate is a premium, localized healthcare booking platform designed for Dubai, Sharjah, and Abu Dhabi. It allows patients to search for top-rated specialists, check branch availability across hospital networks, and securely book appointments online.

## 🛠️ Tech Stack

* **Core/Framework**: Next.js 14 (App Router), React, TypeScript
* **Styling**: Tailwind CSS
* **Database & ORM**: MySQL (hosted on Hostinger), Prisma ORM
* **Authentication**: NextAuth.js, bcrypt
* **Email / Communication**: Nodemailer (SMTP)

## ✨ Features

* **Multi-City UAE Support**: Fully structured database and layouts covering Dubai, Sharjah, and Abu Dhabi.
* **Hospital Networks & Branches**: Added parent `HospitalGroup` and branch `Clinic` tables, enabling dynamic branch routing and location-specific doctor listings.
* **Specialties Management**: Added dynamic `Specialty` catalog, replacing hardcoded strings.
* **Dual Search Mode**: Homepage search supports both a Quick Booking Wizard (3-step cascading dropdowns) and a free-text Search Bar with location filtering.
* **Passwordless Guest Auth**: Enables guest booking patients to login securely using just their email and phone number (automatically registers guest bookings to a shadow user profile).
* **Comprehensive Admin CRUD**: Administrative dashboard panel to manage Doctors, Hospital Groups, Clinic Branches, and Specialties.
* **Patient Dashboard & Tracking**: Secure dashboard for patients to view, manage, and track upcoming appointments.
* **Automated Email Notifications**: Nodemailer-driven booking confirmations for Patients, Doctors, and Admins.

## ⚙️ Local Setup & Run Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file at the root of the project (or copy `.env.example` to `.env`) with the following variables:
```env
# Database Configuration (MySQL)
DATABASE_URL="mysql://username:password@host:port/database_name"

# NextAuth Security
NEXTAUTH_URL="http://localhost:3000" # Update for production
NEXTAUTH_SECRET="your-super-secret-key-for-jwt"

# Nodemailer SMTP Configuration
SMTP_HOST="smtp.hostinger.com"
SMTP_PORT="465"
SMTP_USER="your-email@yourdomain.com"
SMTP_PASS="your-email-password"
ADMIN_EMAIL="admin@docmate.com" # Where system alerts are sent
```

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
node prisma/seed.js # Seeds initial doctors
node prisma/add-admin.js # Creates the demo admin user
```

### 4. Start the Development Server
```bash
npm run dev
```

### 🚀 Deployment (Hostinger)
This application is configured and ready for deployment on Hostinger VPS or shared hosting with Node.js support. Ensure your `DATABASE_URL` points to your Hostinger MySQL instance, and your build command runs `npx prisma generate && npm run build`.
