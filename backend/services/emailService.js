const { createTransporter } = require("../config/emailConfig");

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create HTML email template for OTP
const createOTPEmailTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 50px auto;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 40px 30px;
          text-align: center;
        }
        .otp-box {
          background: #f8f9fa;
          border: 2px dashed #667eea;
          border-radius: 8px;
          padding: 20px;
          margin: 30px 0;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #667eea;
        }
        .message {
          color: #666;
          font-size: 16px;
          line-height: 1.6;
          margin: 20px 0;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          text-align: left;
          color: #856404;
          font-size: 14px;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          color: #999;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Finance Tracker</h1>
          <p style="margin: 10px 0 0 0;">Email Verification</p>
        </div>
        <div class="content">
          <h2 style="color: #333; margin-bottom: 10px;">Verify Your Email Address</h2>
          <p class="message">
            Thank you for registering with Finance Tracker! To complete your registration, 
            please use the following One-Time Password (OTP):
          </p>
          <div class="otp-box">${otp}</div>
          <p class="message">
            This OTP is valid for <strong>10 minutes</strong>. 
            Please do not share this code with anyone.
          </p>
          <div class="warning">
            <strong>⚠️ Security Note:</strong><br>
            If you didn't request this code, please ignore this email. 
            Your account security is important to us.
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0 0 8px 0;">© 2025 Finance Tracker. All rights reserved.</p>
          <p style="margin: 0 0 5px 0; font-size: 12px;">
            Contact: <a href="mailto:durvesh.gaikwad08@gmail.com" style="color: #667eea; text-decoration: none;">durvesh.gaikwad08@gmail.com</a> | 
            <a href="tel:+919136608240" style="color: #667eea; text-decoration: none;">+91 9136608240</a>
          </p>
          <p style="margin: 0; font-size: 12px;">This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send OTP email
const sendOTP = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        "Finance Tracker <noreply@financetracker.com>",
      to: email,
      subject: "Verify Your Email - Finance Tracker Registration",
      html: createOTPEmailTemplate(otp),
      text: `Your Finance Tracker verification code is: ${otp}. This code is valid for 10 minutes. If you didn't request this code, please ignore this email.`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent successfully to:", email);
    console.log("📧 Message ID:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    console.error("❌ Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

module.exports = {
  generateOTP,
  sendOTP,
};
