# Free Email Setup Guide for Contact Form

## Overview
This guide explains how to set up **FREE** email functionality for your portfolio's contact form using Resend. When someone fills out the form, you'll receive an email notification, and they'll get a confirmation email.

## 🆓 **Why Resend?**
- **3,000 emails per month FREE** (perfect for portfolio contact forms)
- **No credit card required** to start
- **Professional email delivery** with high deliverability
- **Simple setup** - just one API key
- **No Gmail setup needed**

## Step 1: Get Free Resend Account

### 1.1 Sign Up for Resend
1. Go to [resend.com](https://resend.com)
2. Click "Get Started" or "Sign Up"
3. Create an account (no credit card required)
4. Verify your email address

### 1.2 Get Your API Key
1. After signing in, go to the "API Keys" section
2. Click "Create API Key"
3. Give it a name like "Portfolio Contact Form"
4. Copy the API key (starts with `re_`)

## Step 2: Environment Variables

Create or update your `.env.local` file in the project root:

```env
# Resend Email Configuration (FREE!)
RESEND_API_KEY=re_your_api_key_here

# Your email address where you want to receive notifications
NOTIFICATION_EMAIL=your.email@example.com

# Existing variables (don't change these)
JWT_SECRET=your-existing-jwt-secret
MONGODB_URI=your-existing-mongodb-uri
```

**Important Notes:**
- `RESEND_API_KEY`: Your Resend API key (starts with `re_`)
- `NOTIFICATION_EMAIL`: Your email where you want to receive contact form notifications
- Never commit your `.env.local` file to version control

## Step 3: Customize Sender Domain (Optional)

By default, emails will be sent from `noreply@yourdomain.com`. To use your own domain:

1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `yourdomain.com`)
3. Follow the DNS setup instructions
4. Update the `from` field in the API route

## Step 4: Test the Setup

1. Restart your development server after adding environment variables
2. Fill out the contact form on your website
3. Check your email for the notification
4. Check the sender's email for the confirmation message

## 📊 **Free Tier Limits**

- **3,000 emails per month** - More than enough for a portfolio
- **100 emails per day** - Good for testing
- **No credit card required**
- **Professional email delivery**

## 🔧 **Customization**

You can customize the email templates by editing the HTML content in `app/api/contact/submit/route.js`. The current templates include:
- Professional styling with your brand colors
- Contact details and message content
- Timestamp and IP address for security
- Confirmation email to the sender

## 🚨 **Troubleshooting**

### Common Issues:
1. **"Resend API key missing"**: Make sure you've added `RESEND_API_KEY` to your `.env.local`
2. **"Invalid API key"**: Check that your API key is correct and starts with `re_`
3. **Emails not sending**: Verify your API key in the Resend dashboard
4. **Form submission errors**: Check the browser console and server logs

### Security Notes:
- Never commit your `.env.local` file to version control
- Resend API keys are secure and can be regenerated if needed
- The contact form includes basic spam protection and rate limiting

## 💰 **Cost Breakdown**

- **Setup**: $0 (completely free)
- **Monthly**: $0 (3,000 emails included)
- **Upgrade**: Only if you exceed 3,000 emails/month (very unlikely for a portfolio)

## 🎯 **Next Steps After Setup**

1. **Test thoroughly** with different email addresses
2. **Monitor your Resend dashboard** for delivery statistics
3. **Customize email templates** to match your brand
4. **Set up domain verification** for professional sender addresses

This setup gives you professional email functionality completely free, with room to grow if needed!
