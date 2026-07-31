import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { fail } from '../../../../lib/api/respond';
import { rateLimit, clientIp } from '../../../../lib/api/rateLimit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Escape user-supplied text before embedding it in email HTML (prevents
// markup/HTML injection into the notification email we receive).
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SubmissionSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.email('Invalid email format').max(320),
  message: z.string().trim().min(10).max(2000),
  website: z.string().optional(), // honeypot
});

export async function POST(request) {
  try {
    // clientIp() prefers headers set by the edge; the old code took the FIRST
    // x-forwarded-for hop, which is client-supplied and so trivially spoofed
    // per request, defeating the only abuse control on this form.
    const ip = clientIp(request);

    const limit = rateLimit(`contact:${ip}`, { limit: 3, windowMs: 15 * 60 * 1000 });
    if (!limit.allowed) {
      return fail(429, 'RATE_LIMITED', 'Too many requests. Please try again later.');
    }

    const parsed = SubmissionSchema.safeParse(await request.json().catch(() => null));

    if (!parsed.success) {
      const first = z.flattenError(parsed.error);
      const message =
        Object.values(first.fieldErrors)[0]?.[0] || 'Please check the form and try again.';
      return fail(400, 'VALIDATION', message);
    }

    const { name, email, message, website } = parsed.data;

    // Honeypot: `website` is a hidden field real users never see/fill.
    // If it's populated, silently accept (so bots don't learn) but drop it.
    if (website) {
      return NextResponse.json({
        ok: true,
        success: true,
        message: 'Thank you! Your message has been received successfully.',
      });
    }

    const linkCount = (message.match(/https?:\/\/[^\s]+/gi) || []).length;
    if (linkCount > 5) {
      return fail(400, 'VALIDATION', 'Message contains too many links. Please review and try again.');
    }

    if (!process.env.RESEND_API_KEY || !process.env.NOTIFICATION_EMAIL) {
      console.error('Contact form: RESEND_API_KEY or NOTIFICATION_EMAIL is not configured');
      return fail(500, 'NOT_CONFIGURED', 'Email service not configured. Please contact the administrator.');
    }

    // Initialize Resend lazily (after confirming the key exists) so the
    // module can be imported at build time without the env var present.
    const resend = new Resend(process.env.RESEND_API_KEY);

    const notificationResult = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev',
      to: [process.env.NOTIFICATION_EMAIL],
      // Hitting Reply now reaches the sender instead of the Resend domain.
      replyTo: email,
      subject: `${name} - Portfolio Contact Form Submission`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color:rgb(25, 26, 27); margin-bottom: 20px;">New Contact Form Submission</h2>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #64ffda;">
              ${escapeHtml(message).replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="background: #e9ecef; padding: 15px; border-radius: 5px; font-size: 14px; color: #6c757d;">
            <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p style="margin: 5px 0 0 0;"><strong>IP Address:</strong> ${escapeHtml(ip)}</p>
            <p style="margin: 5px 0 0 0;"><strong>User Agent:</strong> ${escapeHtml(request.headers.get('user-agent') || 'Unknown')}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      ok: true,
      success: true,
      message:
        'Thank you! Your message has been received successfully. I will get back to you as soon as possible.',
      emailId: notificationResult?.data?.id,
    });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return fail(500, 'SEND_FAILED', 'Failed to send message. Please try again later.');
  }
}
