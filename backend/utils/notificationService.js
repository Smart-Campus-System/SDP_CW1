import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Email Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Your email
    pass: process.env.EMAIL_PASS,  // Your email password or App Password
  },
});

const sendNotification = (userId, message) => {
  console.log(`📩 Notification to User ${userId}: ${message}`);
  // Here you can add logic to send emails or push notifications
};

// Function to send notification email
export const sendNotificationEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Notification email sent to:", to);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};


export default { sendNotification };
