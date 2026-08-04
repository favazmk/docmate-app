import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

// TEMPORARY DIAGNOSTIC ROUTE — delete this file once email delivery is confirmed.
const ACCESS_KEY = "dm-mailcheck-7f3a91";

type Attempt = {
  label: string;
  host: string;
  port: number;
  secure: boolean;
  result: string;
  error?: { message: string; code: string | null; responseCode: number | null; response: string | null };
};

async function tryLogin(label: string, host: string, port: number, secure: boolean): Promise<Attempt> {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
  });

  try {
    await transporter.verify();
    return { label, host, port, secure, result: "OK — login accepted" };
  } catch (err: any) {
    return {
      label,
      host,
      port,
      secure,
      result: "FAILED",
      error: {
        message: err?.message ?? String(err),
        code: err?.code ?? null,
        responseCode: err?.responseCode ?? null,
        response: err?.response ?? null,
      },
    };
  }
}

export async function GET(req: NextRequest) {
  if (req.nextUrl.searchParams.get("key") !== ACCESS_KEY) {
    return new NextResponse("Not found", { status: 404 });
  }

  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.hostinger.com";

  const config = {
    SMTP_HOST: host,
    SMTP_PORT: process.env.SMTP_PORT ?? "(not set)",
    SMTP_USER: process.env.SMTP_USER ?? "(not set)",
    SMTP_PASS: pass ? `set — ${pass.length} characters` : "(not set)",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "(not set)",
    passFirstChar: pass ? pass[0] : null,
    passLastChar: pass ? pass[pass.length - 1] : null,
    passHasNonAscii: pass ? /[^\x20-\x7E]/.test(pass) : false,
  };

  const attempts = [
    await tryLogin("465 SSL (current)", host, 465, true),
    await tryLogin("587 STARTTLS", host, 587, false),
  ];

  const working = attempts.find((a) => a.result.startsWith("OK"));

  const to = req.nextUrl.searchParams.get("to");
  if (!working || !to) {
    return NextResponse.json({
      config,
      attempts,
      next: working
        ? "A port works. Add &to=your@email.com to send a real test message."
        : "Both ports rejected the login. The credentials are being refused by the mail server itself.",
    });
  }

  const transporter = nodemailer.createTransport({
    host: working.host,
    port: working.port,
    secure: working.secure,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Docmate Test" <${process.env.SMTP_USER}>`,
      to,
      subject: "Docmate SMTP test",
      text: "If you are reading this, Docmate can send email successfully.",
    });
    return NextResponse.json({
      config,
      attempts,
      sentVia: working.label,
      sent: { accepted: info.accepted, rejected: info.rejected, response: info.response },
    });
  } catch (err: any) {
    return NextResponse.json({
      config,
      attempts,
      sentVia: working.label,
      sent: "FAILED",
      error: { message: err?.message ?? String(err), response: err?.response ?? null },
    });
  }
}
