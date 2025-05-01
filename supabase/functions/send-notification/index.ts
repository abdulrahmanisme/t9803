import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const SMTP_HOSTNAME = Deno.env.get('SMTP_HOSTNAME') || '';
const SMTP_PORT = parseInt(Deno.env.get('SMTP_PORT') || '587');
const SMTP_USERNAME = Deno.env.get('SMTP_USERNAME') || '';
const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD') || '';
const FROM_EMAIL = 'notifications@collegeconsultancy.com';

const emailTemplates = {
  review_approved: {
    subject: 'Your Review Has Been Approved',
    body: (data: any) => `
      Dear ${data.userName},

      Your review for ${data.agencyName} has been approved and is now visible on our platform.

      Thank you for contributing to our community!

      Best regards,
      College Consultancy Directory Team
    `
  },
  review_rejected: {
    subject: 'Review Update',
    body: (data: any) => `
      Dear ${data.userName},

      We've reviewed your submission for ${data.agencyName}. Unfortunately, we cannot publish it at this time.
      Please ensure your review follows our community guidelines.

      Best regards,
      College Consultancy Directory Team
    `
  },
  new_agency: {
    subject: 'New Agency Listing Submitted',
    body: (data: any) => `
      Hello Admin,

      A new agency listing has been submitted:

      Agency Name: ${data.agencyName}
      Location: ${data.location}
      Contact Email: ${data.contactEmail}

      Please review this submission in your admin dashboard.

      Best regards,
      College Consultancy Directory System
    `
  },
  agency_approved: {
    subject: 'Your Agency Listing Has Been Approved',
    body: (data: any) => `
      Dear ${data.ownerName},

      Congratulations! Your agency listing for "${data.agencyName}" has been approved.
      Your listing is now visible to potential clients on our platform.

      You can manage your listing by logging into your dashboard.

      Best regards,
      College Consultancy Directory Team
    `
  }
};

async function sendEmail(to: string, subject: string, body: string) {
  const client = new SmtpClient();

  await client.connectTLS({
    hostname: SMTP_HOSTNAME,
    port: SMTP_PORT,
    username: SMTP_USERNAME,
    password: SMTP_PASSWORD,
  });

  await client.send({
    from: FROM_EMAIL,
    to,
    subject,
    content: body,
  });

  await client.close();
}

serve(async (req) => {
  try {
    const { to, template, data } = await req.json();

    if (!to || !template || !data) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    const emailTemplate = emailTemplates[template as keyof typeof emailTemplates];
    if (!emailTemplate) {
      return new Response(
        JSON.stringify({ error: 'Invalid template' }),
        { status: 400 }
      );
    }

    await sendEmail(
      to,
      emailTemplate.subject,
      emailTemplate.body(data)
    );

    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending notification:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send notification' }),
      { status: 500 }
    );
  }
});