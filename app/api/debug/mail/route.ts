import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

// TEMPORARY DIAGNOSTIC ROUTE — delete this file once email delivery is confirmed.
const ACCESS_KEY = "dm-mailcheck-7f3a91";

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== ACCESS_KEY) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pass = process.env.SMTP_PASS;

  const config = {
    SMTP_HOST: process.env.SMTP_HOST ?? "(not set)",
    SMTP_PORT: process.env.SMTP_PORT ?? "(not set)",
    SMTP_USER: process.env.SMTP_USER ?? "(not set)",
    SMTP_PASS: pass ? `set — ${pass.length} characters` : "(not set)",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "(not set)",
    passHasSpaces: pass ? /\s/.test(pass) : false,
    passHasQuotes: pass ? /^["']|["']$/.test(pass) : false,
  };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  let connection: string;
  try {
    await transporter.verify();
    connection = "OK — the mail server accepted the login.";
  } catch (err: any) {
    return NextResponse.json(
      {
        config,
        connection: "FAILED",
        error: {
          message: err?.message ?? String(err),
          code: err?.code ?? null,
          responseCode: err?.responseCode ?? null,
          response: err?.response ?? null,
        },
      },
      { status: 200 }
    );
  }

  // Login worked. Optionally send a real test message: &to=you@example.com
  const to = req.nextUrl.searchParams.get("to");
  if (!to) {
    return NextResponse.json({
      config,
      connection,
      next: "Login works. Add &to=your@email.com to this URL to send a real test message.",
    });
  }

  try {
    const info = await transporter.sendMail({
      from: `"Docmate Test" <${process.env.SMTP_USER}>`,
      to,
      subject: "Docmate SMTP test",
      text: "If you are reading this, Docmate can send email successfully.",
    });
    return NextResponse.json({
      config,
      connection,
      sent: { accepted: info.accepted, rejected: info.rejected, response: info.response },
    });
  } catch (err: any) {
    return NextResponse.json({
      config,
      connection,
      sent: "FAILED",
      error: {
        message: err?.message ?? String(err),
        code: err?.code ?? null,
        responseCode: err?.responseCode ?? null,
        response: err?.response ?? null,
      },
    });
  }
}
