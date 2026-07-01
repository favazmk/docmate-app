import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendAppointmentEmails({
  patientEmail,
  patientName,
  doctorEmail,
  doctorName,
  appointmentDate,
  appointmentTime,
}: {
  patientEmail: string;
  patientName: string;
  doctorEmail: string;
  doctorName: string;
  appointmentDate: string;
  appointmentTime: string;
}) {
  // Use the admin email if provided in env, else fallback to a placeholder
  const adminEmail = process.env.ADMIN_EMAIL || "admin@docmate.com";

  if (!process.env.SMTP_USER) {
    console.warn("SMTP credentials not set. Email notifications will not be sent.");
    return;
  }

  try {
    // 1. Send Confirmation to Patient
    await transporter.sendMail({
      from: `"Docmate Support" <${process.env.SMTP_USER}>`,
      to: patientEmail,
      subject: "Appointment Confirmation - Docmate",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #2200CC; margin-top: 0;">Appointment Confirmed!</h2>
          <p>Hello <strong>${patientName}</strong>,</p>
          <p>Your appointment has been successfully booked with <strong>${doctorName}</strong>.</p>
          
          <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Date:</strong> ${appointmentDate}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${appointmentTime}</p>
          </div>
          
          <p>If you need to reschedule or cancel, please log in to your patient dashboard.</p>
          <p style="margin-bottom: 0;">Best regards,<br/><strong>The Docmate Team</strong></p>
        </div>
      `,
    });

    // 2. Send Notification to Doctor
    if (doctorEmail) {
      await transporter.sendMail({
        from: `"Docmate Alerts" <${process.env.SMTP_USER}>`,
        to: doctorEmail,
        subject: "New Appointment Booked - Docmate",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #2200CC; margin-top: 0;">New Appointment Received</h2>
            <p>Hello <strong>${doctorName}</strong>,</p>
            <p>You have a new patient booking via Docmate.</p>
            
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Patient:</strong> ${patientName}</p>
              <p style="margin: 4px 0;"><strong>Date:</strong> ${appointmentDate}</p>
              <p style="margin: 4px 0;"><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            
            <p style="margin-bottom: 0;">Please log in to your provider dashboard to view more details.</p>
          </div>
        `,
      });
    }

    // 3. Send Alert to Docmate Admin
    await transporter.sendMail({
      from: `"Docmate System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Booking Alert: ${doctorName}`,
      html: `
        <div style="font-family: sans-serif;">
          <h3>New Platform Booking</h3>
          <p>A new appointment was just booked on Docmate.</p>
          <ul>
            <li><strong>Patient:</strong> ${patientName} (${patientEmail})</li>
            <li><strong>Doctor:</strong> ${doctorName}</li>
            <li><strong>Date & Time:</strong> ${appointmentDate} at ${appointmentTime}</li>
          </ul>
        </div>
      `,
    });

    console.log("Appointment emails dispatched successfully.");
  } catch (error) {
    console.error("Error sending appointment emails:", error);
  }
}
