import { Resend } from "resend"

let client: Resend | null = null

function getClient(): Resend {
  if (!client) {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set")
    client = new Resend(process.env.RESEND_API_KEY)
  }
  return client
}

export async function sendMagicLink(email: string, link: string): Promise<void> {
  const from = process.env.EMAIL_FROM ?? "Mezcalito <onboarding@resend.dev>"
  const html = `
    <div style="font-family:Inter,system-ui,sans-serif;max-width:480px;margin:32px auto;padding:24px;border:1px solid #eee;border-radius:16px">
      <h1 style="font-size:20px;margin:0 0 12px;background:linear-gradient(135deg,#a855f7,#ec4899);-webkit-background-clip:text;background-clip:text;color:transparent">Mezcalito</h1>
      <p style="font-size:15px;color:#222;margin:0 0 16px">Tap the button below to sign in. Link expires in 1 hour.</p>
      <p style="margin:24px 0">
        <a href="${link}" style="display:inline-block;padding:12px 20px;border-radius:9999px;background:linear-gradient(135deg,#a855f7,#ec4899);color:white;text-decoration:none;font-weight:600">Sign in to Mezcalito</a>
      </p>
      <p style="font-size:12px;color:#888;margin:24px 0 0">If you didn't request this, you can ignore this email.</p>
    </div>
  `
  const text = `Sign in to Mezcalito: ${link}\n\nLink expires in 1 hour. If you didn't request this, ignore this email.`
  await getClient().emails.send({
    from,
    to: email,
    subject: "Sign in to Mezcalito",
    html,
    text,
  })
}
