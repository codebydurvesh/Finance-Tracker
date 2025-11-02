// Quick test to diagnose email issues on Render
require("dotenv").config();

async function testEmailConfig() {
  console.log("\n🔍 Checking Email Configuration...\n");

  // Check environment variables
  console.log("📧 EMAIL_SERVICE:", process.env.EMAIL_SERVICE || "❌ NOT SET");
  console.log("📧 EMAIL_USER:", process.env.EMAIL_USER || "❌ NOT SET");
  console.log(
    "📧 EMAIL_PASSWORD:",
    process.env.EMAIL_PASSWORD ? "✅ SET (hidden)" : "❌ NOT SET"
  );
  console.log("📧 EMAIL_FROM:", process.env.EMAIL_FROM || "❌ NOT SET");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error("\n❌ Email credentials not found in environment variables!");
    console.error("Make sure EMAIL_USER and EMAIL_PASSWORD are set on Render");
    process.exit(1);
  }

  console.log("\n✅ All email environment variables are set!");
  console.log("\n🧪 Testing email connection...");

  try {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log("✅ Email transporter verified successfully!");

    // Try sending a test email
    console.log("\n📨 Attempting to send test OTP email...");

    const testOTP = "123456";
    const info = await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        "Finance Tracker <noreply@financetracker.com>",
      to: process.env.EMAIL_USER, // Send to yourself
      subject: "Test OTP - Finance Tracker",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Test OTP Email</h2>
          <p>Your test verification code is:</p>
          <h1 style="color: #667eea; font-size: 48px; letter-spacing: 8px;">${testOTP}</h1>
          <p>If you received this, the email system is working correctly!</p>
        </div>
      `,
      text: `Your test verification code is: ${testOTP}`,
    });

    console.log("✅ Test email sent successfully!");
    console.log("📧 Message ID:", info.messageId);
    console.log("📬 Check your email:", process.env.EMAIL_USER);
    console.log("\n🎉 Email system is working correctly!");
  } catch (error) {
    console.error("\n❌ Email test failed!");
    console.error("Error:", error.message);

    if (error.code === "EAUTH") {
      console.error("\n🔐 Authentication failed. Possible issues:");
      console.error("1. Wrong email or password");
      console.error("2. App password not enabled (for Gmail)");
      console.error("3. Go to: https://myaccount.google.com/apppasswords");
    } else if (error.code === "ETIMEDOUT" || error.code === "ECONNECTION") {
      console.error("\n⏱️ Connection timeout. Possible issues:");
      console.error("1. Render's free tier may have firewall restrictions");
      console.error("2. Gmail may be blocking the connection");
      console.error(
        "3. Try using a different email service (SendGrid, Mailgun)"
      );
    } else {
      console.error("\n🔍 Error details:", error);
    }

    process.exit(1);
  }
}

testEmailConfig();
