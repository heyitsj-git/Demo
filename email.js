// email.js
// Load envs locally only; on Vercel envs are injected
if (!process.env.VERCEL) {
  require('dotenv').config();
  require('dotenv').config({ path: './sendgrid.env' });
}

const sgMail = require('@sendgrid/mail');

// Initialize API key if available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * sendEmail - send an email using SendGrid
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - HTML body
 * @param {boolean} eu - send with EU Data Residency
 */
async function sendEmail(to, subject, html, eu = false) {
  if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_API_KEY.startsWith('SG.')) {
    throw new Error('Invalid SENDGRID_API_KEY: set it in Vercel Environment Variables');
  }
  if (!process.env.EMAIL_USER) {
    throw new Error('EMAIL_USER not set: configure verified sender in Vercel Environment Variables');
  }
  const msg = {
    to,
    from: process.env.EMAIL_USER, // Must be a verified sender in SendGrid
    subject,
    html,
    ...(eu && { setDataResidency: 'eu' })
  };

  try {
    const response = await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    console.log('SendGrid response status:', response[0].statusCode);
    return response;
  } catch (err) {
    console.error('❌ SendGrid error:', err.response ? err.response.body : err.message);
    throw err;
  }
}

module.exports = sendEmail;
