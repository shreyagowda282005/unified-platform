// Save as: backend/src/services/emailService.js

const nodemailer = require('nodemailer');

const emailPort = Number(process.env.EMAIL_PORT) || 465;

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: emailPort,
  secure: emailPort === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, userName) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your GlowSync Account - OTP',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌟 GlowSync</h1>
            <p>Verify Your Account</p>
          </div>
          <div class="content">
            <h2>Hello ${userName || 'there'}! 👋</h2>
            <p>Thank you for signing up with GlowSync. To complete your registration, please verify your email address using the OTP below:</p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
              <div class="otp-code">${otp}</div>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP will expire in <strong>10 minutes</strong></li>
              <li>Don't share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
            
            <p>Welcome to the GlowSync community! 🚀</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} GlowSync. All rights reserved.</p>
            <p>This is an automated email, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName, userType) => {
  const dashboardLink = userType === 'brand' 
    ? `${process.env.FRONTEND_URL}/brand/dashboard`
    : `${process.env.FRONTEND_URL}/influencer/dashboard`;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to GlowSync! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          .feature-box { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌟 Welcome to GlowSync!</h1>
          </div>
          <div class="content">
            <h2>Hi ${userName}! 👋</h2>
            <p>Your account has been successfully verified and activated. Welcome to the GlowSync community!</p>
            
            <div class="feature-box">
              <h3>✨ What's Next?</h3>
              ${userType === 'influencer' ? `
                <ul>
                  <li>Complete your profile to get discovered</li>
                  <li>Browse available campaigns</li>
                  <li>Connect with top brands</li>
                  <li>Track your earnings</li>
                </ul>
              ` : `
                <ul>
                  <li>Create your first campaign</li>
                  <li>Discover talented influencers</li>
                  <li>Manage collaborations</li>
                  <li>Track campaign analytics</li>
                </ul>
              `}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${dashboardLink}" class="button">Go to Dashboard</a>
            </div>
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Happy collaborating! 🚀</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendWelcomeEmail,
};