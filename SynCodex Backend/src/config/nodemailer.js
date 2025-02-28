import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail", // Using Gmail as the email provider
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS, // Your Gmail app password
  },
});

export default transporter;
