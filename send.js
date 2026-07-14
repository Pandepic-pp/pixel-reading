require('dotenv').config();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const store = require('./lib/store');

const [, , to, subjectArg] = process.argv;

if (!to) {
  console.error('Usage: npm run send -- <to@example.com> ["Subject"]');
  process.exit(1);
}

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
const subject = subjectArg || 'Hello';
const trackingId = crypto.randomUUID();

const pixelUrl = `${BASE_URL}/track/${trackingId}.png`;

const html = `
  <div>
    <p>Hi,</p>
    <p>This is a test email sent from the read-receipt POC.</p>
    <p>Best,<br/>${process.env.SMTP_FROM || 'Sender'}</p>
  </div>
  <img src="${pixelUrl}" width="1" height="1" style="display:none" alt="" />
`;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function main() {
  store.createTracker(trackingId, {
    to,
    subject,
    sentAt: new Date().toISOString(),
  });

  const info = await transporter.sendMail({
    from: `"${process.env.SMTP_FROM}" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log('Message sent:', info.messageId);
  console.log('Tracking ID:', trackingId);
  console.log('Check status at:', `${BASE_URL}/opens/${trackingId}`);
}

main().catch((err) => {
  console.error('Failed to send mail:', err);
  process.exit(1);
});
