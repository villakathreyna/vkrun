import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail({ to, subject, registrant, payment }: {
  to: string;
  subject: string;
  registrant: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    gender: string;
    distanceCategory: string;
    pricePHP: number;
    finisherShirt?: boolean;
  };
  payment: {
    method: string;
    amount: number;
    date: string;
  };
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
      <div style="background: #1e293b; color: #fff; padding: 24px 32px;">
        <h2 style="margin: 0;">Villa Kathreyna Run Registration Receipt</h2>
      </div>
      <div style="padding: 24px 32px;">
        <h3 style="margin-top: 0;">Registrant Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><b>Name:</b></td><td>${registrant.firstName} ${registrant.lastName}</td></tr>
          <tr><td><b>Email:</b></td><td>${registrant.email}</td></tr>
          <tr><td><b>Phone:</b></td><td>${registrant.phone}</td></tr>
          <tr><td><b>Address:</b></td><td>${registrant.address}</td></tr>
          <tr><td><b>Birthday:</b></td><td>${registrant.birthday}</td></tr>
          <tr><td><b>Gender:</b></td><td>${registrant.gender}</td></tr>
          <tr><td><b>Distance Category:</b></td><td>${registrant.distanceCategory}</td></tr>
          <tr><td><b>Finisher Shirt:</b></td><td>${registrant.finisherShirt ? 'Yes' : 'No'}</td></tr>
        </table>
        <h3 style="margin-bottom: 0;">Payment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><b>Method:</b></td><td>${payment.method}</td></tr>
          <tr><td><b>Amount:</b></td><td>₱${payment.amount.toLocaleString()}</td></tr>
          <tr><td><b>Date:</b></td><td>${payment.date}</td></tr>
        </table>
        <div style="margin-top: 32px; font-size: 1.1em; color: #16a34a;">
          <b>Thank you for registering!<br/>See you at the event!</b>
        </div>
      </div>
      <div style="background: #f1f5f9; color: #64748b; padding: 16px 32px; font-size: 0.95em; text-align: center;">
        This is an automated email. For questions, contact hello@villakathreyna.com
      </div>
    </div>
  `;
  await resend.emails.send({
    from: process.env.RESEND_FROM || 'onboarding@resend.dev',
    to,
    subject,
    html,
  });
}
