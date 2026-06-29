const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined
  });
}

async function sendContactNotification({ name, email, phone, message }) {
  const transport = createTransport();
  const to = process.env.MAIL_TO || process.env.SMTP_USER;
  const from = process.env.MAIL_FROM || 'noreply@localhost';
  if (!transport) {
    return { sent: false, reason: 'no_smtp' };
  }
  if (!to) {
    return { sent: false, reason: 'no_recipient' };
  }
  await transport.sendMail({
    from,
    to,
    subject: `הודעה חדשה מאתר — ${name}`,
    replyTo: email,
    text: `שם: ${name}\nאימייל: ${email}\nטלפון: ${phone || '-'}\n\n${message}`
  });
  return { sent: true };
}

module.exports = { sendContactNotification };
