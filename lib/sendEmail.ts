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
    entitlementSize?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    team?: string;
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
        <h2 style="margin: 0;">🏳️‍🌈 Villa Kathreyna Run: Spectrum of Strength - A Pride & Fiesta Run 2026 Registration Receipt 🏃‍♂️</h2>
      </div>
      <div style="padding: 24px 32px;">
        <div style="background: #f9fafb; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; text-align: center;">
          <h2 style="margin: 0 0 8px 0; font-size: 1.3em;">🎉 Event Details</h2>
          <div style="font-size: 1.1em; line-height: 1.5;">
            <b>Villa Kathreyna Run</b> <span style="font-size:1.2em;">🏃‍♀️🏳️‍🌈</span><br/>
            Spectrum of Strength<br/>
            <b>A Pride & Fiesta Run 2026</b> <span style="font-size:1.2em;">🎊</span><br/>
            <b>June 21, 2026, 5:00 AM</b> <span style="font-size:1.2em;">⏰</span><br/>
            <br/>
            <b>Villa Kathreyna Event Place & Resort</b> <span style="font-size:1.2em;">📍</span><br/>
            Planza, San Fernando, Camarines Sur
          </div>
        </div>

        <!-- Social Media Invitation -->
        <div style="background: #fffbe6; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; text-align: center; border: 1px solid #ffe066;">
          <h3 style="margin: 0 0 8px 0; font-size: 1.1em; color: #c47f00;">📢 Stay Connected!</h3>
          <p style="margin: 0 0 8px 0; font-size: 1em; color: #7c4700;">
            For more updates, photos, and announcements, follow & like our pages:
          </p>
          <div style="display: flex; flex-direction: column; gap: 6px; align-items: center; font-size: 1em;">
            <a href="https://www.facebook.com/villakathreyna" style="color: #1877f2; text-decoration: none;" target="_blank">🏠 Villa Kathreyna Event Place & Resort</a>
            <a href="https://www.facebook.com/labellacaferestobar" style="color: #1877f2; text-decoration: none;" target="_blank">☕ La Bella Café & Resto Bar</a>
            <a href="https://www.facebook.com/villakathreynaevents" style="color: #1877f2; text-decoration: none;" target="_blank">🏳️‍🌈 Villa Kathreyna Run - Pride & Fiesta Run 2026</a>
            <a href="https://www.facebook.com/rkreationscatering" style="color: #1877f2; text-decoration: none;" target="_blank">🍽️ RKreatioNs Event Styling & Catering Services</a>
          </div>
        </div>

        <h3 style="margin-top: 0;">Registrant Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><b>Name:</b></td><td>${registrant.firstName} ${registrant.lastName}</td></tr>
          <tr><td><b>Email:</b></td><td>${registrant.email}</td></tr>
          <tr><td><b>Phone:</b></td><td>${registrant.phone}</td></tr>
          <tr><td><b>Address:</b></td><td>${registrant.address}</td></tr>
          <tr><td><b>Birthday:</b></td><td>${registrant.birthday}</td></tr>
          <tr><td><b>Gender:</b></td><td>${registrant.gender}</td></tr>
          <tr><td><b>Distance Category:</b></td><td>${registrant.distanceCategory}</td></tr>
          <tr><td><b>Entitlement Size:</b></td><td>${registrant.entitlementSize}</td></tr>
          <tr><td><b>Emergency Contact Name:</b></td><td>${registrant.emergencyContactName}</td></tr>
          <tr><td><b>Emergency Contact Number:</b></td><td>${registrant.emergencyContactNumber}</td></tr>
          <tr><td><b>Team:</b></td><td>${registrant.team || ''}</td></tr>
          <tr><td><b>Finisher Shirt:</b></td><td>${registrant.finisherShirt ? 'Yes' : 'No'}</td></tr>
        </table>
        <h3 style="margin-bottom: 0;">Payment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td><b>Method:</b></td><td>${payment.method}</td></tr>
          <tr><td><b>Amount:</b></td><td>₱${payment.amount.toLocaleString()}</td></tr>
          <tr><td><b>Date:</b></td><td>${payment.date}</td></tr>
        </table>
        <div style="margin-top: 32px; font-size: 1.1em; color: #16a34a;">
          <b>Thank you for registering! <span style="font-size:1.2em;">🎽</span><br/>See you at the event! <span style="font-size:1.2em;">🥳</span></b>
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
