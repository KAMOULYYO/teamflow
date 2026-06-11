import nodemailer from "nodemailer"

function getTransporter() {
  // Use configured SMTP if available
  if (process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT ?? "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }

  // Gmail shortcut: set GMAIL_USER + GMAIL_APP_PASSWORD
  if (process.env.GMAIL_USER) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })
  }

  return null
}

interface InviteEmailOptions {
  to: string
  inviterName: string
  teamName: string
  role: string
  acceptUrl: string
}

export async function sendInviteEmail(opts: InviteEmailOptions): Promise<{ sent: boolean; previewUrl?: string }> {
  const { to, inviterName, teamName, role, acceptUrl } = opts

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#0f0f14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0f14;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#1a1a2e;border-radius:16px;overflow:hidden;border:1px solid #2a2a3e">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#6366f1);padding:32px 40px;text-align:center">
            <div style="display:inline-flex;align-items:center;gap:10px">
              <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-block;line-height:36px;text-align:center;font-size:18px">⚡</div>
              <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px">TeamFlow Pro</span>
            </div>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px">
            <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 8px">You're invited! 🎉</h1>
            <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px">
              <strong style="color:#e2e8f0">${inviterName}</strong> has invited you to join the
              <strong style="color:#a78bfa">${teamName}</strong> team on TeamFlow Pro as a <strong style="color:#e2e8f0">${role}</strong>.
            </p>

            <div style="background:#12122a;border:1px solid #2a2a3e;border-radius:12px;padding:20px;margin:24px 0">
              <p style="color:#94a3b8;font-size:13px;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.5px">Team</p>
              <p style="color:#a78bfa;font-size:18px;font-weight:600;margin:0">${teamName}</p>
            </div>

            <div style="text-align:center;margin:32px 0">
              <a href="${acceptUrl}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#6366f1);color:white;text-decoration:none;font-size:15px;font-weight:600;padding:14px 32px;border-radius:12px;letter-spacing:-0.2px">
                Accept Invitation →
              </a>
            </div>

            <p style="color:#64748b;font-size:13px;text-align:center;margin:16px 0 0">
              This invitation expires in 7 days. If you didn't expect this, you can ignore this email.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #2a2a3e;text-align:center">
            <p style="color:#475569;font-size:12px;margin:0">TeamFlow Pro · Manage Teams Faster Than Ever</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`

  const transporter = getTransporter()

  if (!transporter) {
    // No email config — log to console for dev/testing
    console.log("\n========================================")
    console.log("📧 INVITATION EMAIL (no SMTP configured)")
    console.log(`To: ${to}`)
    console.log(`Team: ${teamName}`)
    console.log(`Accept URL: ${acceptUrl}`)
    console.log("========================================\n")
    return { sent: false, previewUrl: acceptUrl }
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? `"TeamFlow Pro" <noreply@teamflowpro.com>`,
      to,
      subject: `${inviterName} invited you to join ${teamName} on TeamFlow Pro`,
      html,
      text: `${inviterName} invited you to join ${teamName}. Accept here: ${acceptUrl}`,
    })
    console.log(`✅ Email sent to ${to}`)
    return { sent: true }
  } catch (err) {
    console.error("❌ SMTP error:", err)
    // Fallback: log the link
    console.log(`📧 Invite URL (email failed): ${acceptUrl}`)
    return { sent: false, previewUrl: acceptUrl }
  }
}
