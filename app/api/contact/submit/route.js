import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Simple in-memory rate limiting (for production, consider using Redis)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 submissions per 15 minutes

// Rate limiting function
function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  
  const requests = rateLimitMap.get(ip);
  const recentRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  return true; // Allowed
}

// POST - Handle contact form submission and send email
export async function POST(request) {
  try {
    // Get client IP for rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    // Check rate limiting
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Basic spam protection - check message length and content
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters' },
        { status: 400 }
      );
    }

    // Check for suspicious patterns (basic spam detection)
    const suspiciousPatterns = [
      /http[s]?:\/\/[^\s]+/g, // URLs
      /[A-Z]{10,}/g, // ALL CAPS words
      /[!]{3,}/g, // Multiple exclamation marks
    ];
    
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
      pattern.test(message)
    );
    
    if (hasSuspiciousContent) {
      return NextResponse.json(
        { error: 'Message contains suspicious content. Please review and try again.' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error('Resend API key missing');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    if (!process.env.NOTIFICATION_EMAIL) {
      console.error('NOTIFICATION_EMAIL environment variable missing');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact the administrator.' },
        { status: 500 }
      );
    }

    console.log('Environment variables loaded:', {
      hasResendKey: !!process.env.RESEND_API_KEY,
      notificationEmail: process.env.NOTIFICATION_EMAIL,
      resendKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 3)
    });

    console.log('Attempting to send notification email to:', process.env.NOTIFICATION_EMAIL);

    // Email content for you (the recipient)
    const notificationEmail = {
      from: 'onboarding@resend.dev', // Use Resend's default verified domain
      to: [process.env.NOTIFICATION_EMAIL],
      subject: `${name} - Portfolio Contact Form Submission`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color:rgb(25, 26, 27); margin-bottom: 20px;">New Contact Form Submission</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #64ffda;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 5px; font-size: 14px; color: #6c757d;">
            <p style="margin: 0;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p style="margin: 5px 0 0 0;"><strong>IP Address:</strong> ${clientIP}</p>
            <p style="margin: 5px 0 0 0;"><strong>User Agent:</strong> ${request.headers.get('user-agent') || 'Unknown'}</p>
          </div>
        </div>
      `,
    };

    // Send the notification email to you
    const notificationResult = await resend.emails.send(notificationEmail);
    console.log('Notification email result:', notificationResult);

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you! Your message has been received successfully. I will get back to you as soon as possible.',
      emailId: notificationResult?.id
    });

  } catch (error) {
    console.error('Error sending contact form email:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
