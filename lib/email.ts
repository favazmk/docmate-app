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
  patientPhone,
  patientReason,
  doctorEmail,
  doctorName,
  clinicName,
  appointmentDate,
  appointmentTime,
}: {
  patientEmail: string;
  patientName: string;
  patientPhone: string;
  patientReason: string;
  doctorEmail: string;
  doctorName: string;
  clinicName: string;
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
    const promises = [];

    // 1. Send Confirmation to Patient
    promises.push(
      transporter.sendMail({
        from: `"Docmate Support" <${process.env.SMTP_USER}>`,
        to: patientEmail,
        subject: "Appointment Request Received - Docmate",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #2200CC; margin-top: 0;">Request Received!</h2>
            <p>Hello <strong>${patientName}</strong>,</p>
            <p>Your appointment request has been received for <strong>${doctorName}</strong>.</p>
            
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 4px 0;"><strong>Preferred Date:</strong> ${appointmentDate}</p>
              <p style="margin: 4px 0;"><strong>Time Slot:</strong> Pending call confirmation</p>
            </div>
            
            <p><strong>What's next?</strong> A coordinator from the hospital will call you shortly on your provided phone number to finalize your exact appointment time slot.</p>
            <p style="margin-top: 20px; margin-bottom: 0;">Best regards,<br/><strong>The Docmate Team</strong></p>
          </div>
        `,
      })
    );

    // 2. Send Notification to Hospital / Clinic
    if (doctorEmail) {
      promises.push(
        transporter.sendMail({
          from: `"Docmate Alerts" <${process.env.SMTP_USER}>`,
          to: doctorEmail,
          subject: `New Appointment Request: ${doctorName} - Docmate`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
              <h2 style="color: #2200CC; margin-top: 0;">New Booking Request Received</h2>
              <p>Hello Clinic Coordinator,</p>
              <p>A patient has requested an appointment with <strong>${doctorName}</strong> at <strong>${clinicName}</strong> via Docmate.</p>
              
              <div style="background-color: #f8fafc; padding: 18px; border-radius: 8px; margin: 20px 0; border: 1px solid #cbd5e1;">
                <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px;">Patient Details</h3>
                <p style="margin: 6px 0;"><strong>Name:</strong> ${patientName}</p>
                <p style="margin: 6px 0;"><strong>Email:</strong> ${patientEmail}</p>
                <p style="margin: 6px 0;"><strong>Phone Number:</strong> ${patientPhone}</p>
                <p style="margin: 6px 0;"><strong>Preferred Date:</strong> ${appointmentDate}</p>
                <p style="margin: 6px 0;"><strong>Time Slot:</strong> Pending Callback Confirmation</p>
                <p style="margin: 6px 0;"><strong>Reason for Visit:</strong> ${patientReason || "None specified"}</p>
              </div>
              
              <p style="color: #1e3a8a; font-size: 15px; font-weight: bold; background-color: #eff6ff; padding: 12px; border-radius: 8px; border: 1px solid #bfdbfe;">
                <strong>Action Required:</strong> Please call the patient directly at their phone number above to confirm their booking and schedule their exact appointment time.
              </p>
              <p style="margin-top: 24px; margin-bottom: 0; font-size: 14px; color: #94a3b8;">Best regards,<br/><strong>The Docmate Team</strong></p>
            </div>
          `,
        })
      );
    }

    // 3. Send Alert to Docmate Admin
    promises.push(
      transporter.sendMail({
        from: `"Docmate System" <${process.env.SMTP_USER}>`,
        to: adminEmail,
        subject: `New Booking Alert: ${doctorName}`,
        html: `
          <div style="font-family: sans-serif;">
            <h3>New Platform Booking</h3>
            <p>A new appointment was just booked on Docmate.</p>
            <ul>
              <li><strong>Patient:</strong> ${patientName} (${patientEmail}, Phone: ${patientPhone})</li>
              <li><strong>Doctor:</strong> ${doctorName}</li>
              <li><strong>Date & Time:</strong> ${appointmentDate} at ${appointmentTime}</li>
              <li><strong>Reason:</strong> ${patientReason}</li>
            </ul>
          </div>
        `,
      })
    );

    const results = await Promise.allSettled(promises);
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.error(`Email ${index + 1} failed to send:`, result.reason);
      }
    });

    console.log("Appointment emails processing complete.");
  } catch (error) {
    console.error("Critical error in sendAppointmentEmails:", error);
  }
}

export async function sendContactEmail(formData: FormData) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@docmate.com";
  
  if (!process.env.SMTP_USER) {
    console.warn("SMTP credentials not set. Email will not be sent.");
    return { success: false, error: "SMTP not configured" };
  }

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  try {
    await transporter.sendMail({
      from: `"Docmate Contact Form" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `Contact Request: ${subject}`,
      html: `
        <div style="font-family: sans-serif;">
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export async function sendClinicRequestEmail(formData: FormData) {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@docmate.com";
  
  if (!process.env.SMTP_USER) {
    console.warn("SMTP credentials not set. Email will not be sent.");
    return { success: false, error: "SMTP not configured" };
  }

  const clinicName = formData.get("clinicName") as string;
  const city = formData.get("city") as string;
  const contactPerson = formData.get("contactPerson") as string;
  const role = formData.get("role") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const size = formData.get("size") as string;

  try {
    await transporter.sendMail({
      from: `"Docmate Clinic Request" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Clinic Registration Request: ${clinicName}`,
      html: `
        <div style="font-family: sans-serif;">
          <h3>New Clinic Registration Request</h3>
          <p><strong>Clinic Name:</strong> ${clinicName}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Contact Person:</strong> ${contactPerson} (${role})</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Number of Doctors:</strong> ${size}</p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Error sending clinic request email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
