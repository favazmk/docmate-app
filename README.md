# Docmate - GCC Doctor Booking Platform 🏥

Docmate is a premium, localized healthcare booking platform designed specifically for the UAE and GCC region. It allows patients to search for top-rated specialists, check real-time availability, and securely book appointments online.

## 🚀 Key Features

* **Localized UAE SEO Routes**: Dynamic emirate-based routing (e.g., `/dubai/cardiologist`) optimized for search engines.
* **Patient Dashboard**: Secure login for patients to view, manage, and review their past and upcoming appointments.
* **Admin Dashboard**: Comprehensive management interface to view live metrics, add new doctors with full profiles, and monitor all platform bookings.
* **Real-time Availability Search**: Powerful filtering by specialty, city, and date.
* **Automated Email Notifications**: Instant confirmation emails sent to the Patient, Doctor, and Admin via Nodemailer upon booking.
* **Secure Authentication**: Built with NextAuth.js and bcrypt for password hashing.
* **Modern Tech Stack**: Next.js 14 (App Router), Tailwind CSS, Prisma ORM, and MySQL (hosted on Hostinger).

## 🛠️ Environment Setup

To run this project locally or deploy it to production, you need the following environment variables configured in a `.env` file at the root of your project:

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

## 📦 Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   node prisma/seed.js # Seeds initial doctors
   node prisma/add-admin.js # Creates the demo admin user
   ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment (Hostinger)

This application is configured and ready for deployment on Hostinger VPS or shared hosting with Node.js support. Ensure your `DATABASE_URL` points to your Hostinger MySQL instance, and your build command runs `npx prisma generate && npm run build`.
