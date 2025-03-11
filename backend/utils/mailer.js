import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter using your Gmail credentials (App Password or Gmail Password)
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email
    pass: process.env.EMAIL_PASS, // Your Gmail password or app password (for 2-step verification)
  },
});

// Send email function
export const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender email
    to, // Recipient email
    subject, // Email subject
    text, // Plain text body
    html, // HTML body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error); // Log the error in case of failure
    } else {
      console.log("Email sent:", info.response); // Log success message
    }
  });
};
