// Test email configuration
require("dotenv").config();
const { createTransporter } = require("./config/emailConfig");

const testEmail = async () => {
  try {
    console.log("📧 Testing email configuration...");
    console.log("Email User:", process.env.EMAIL_USER);
    console.log("Email Service:", process.env.EMAIL_SERVICE);
    console.log("Email From:", process.env.EMAIL_FROM);

    const transporter = createTransporter();

    // Verify connection
    console.log("\n🔍 Verifying SMTP connection...");
    await transporter.verify();
    console.log("✅ SMTP connection verified successfully!");

    // Send test email
    console.log("\n📨 Sending test email...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: "Test Email - Finance Tracker",
      text: "This is a test email from Finance Tracker. If you receive this, your email configuration is working!",
      html: "<h1>✅ Email Configuration Test</h1><p>Your email service is configured correctly!</p>",
    });

    console.log("✅ Test email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("\n✨ Email configuration is working perfectly!");
  } catch (error) {
    console.error("\n❌ Email configuration error:");
    console.error("Error:", error.message);
    console.error("Code:", error.code);
    console.error("\n💡 Troubleshooting:");
    console.error("1. Make sure 2FA is enabled on your Gmail account");
    console.error(
      "2. Generate an App Password at: https://myaccount.google.com/apppasswords"
    );
    console.error(
      "3. Use the 16-character app password (no spaces) in EMAIL_PASSWORD"
    );
    console.error("4. Check that EMAIL_USER is your correct Gmail address");
  }

  process.exit(0);
};

testEmail();
