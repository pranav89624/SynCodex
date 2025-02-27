import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js"; // Import Nodemailer Config
import dotenv from "dotenv";
import { db } from "../config/firebase.js";  // ✅ Import the initialized Firestore instance

dotenv.config();

// ✅ User Registration Function
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1️⃣ Check if the user already exists
    const userRef = db.collection("users").doc(email);
    const userSnapshot = await userRef.get();

    if (userSnapshot.exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2️⃣ Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Store user data in Firebase Firestore
    await userRef.set({
      fullName,
      email,
      password: hashedPassword, // Hashed password
      createdAt: new Date(),
    });

    // 4️⃣ Send Welcome Email
    await sendWelcomeEmail(email, fullName);

    // 5️⃣ Return success response with token
    res.status(201).json({
      message: "User registered successfully! Please login.",
      user: { fullName, email },
    });

  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Function to Send Welcome Email
const sendWelcomeEmail = async (email, fullName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to SynCodex!",
      html: `
        <h2>Welcome, ${fullName}!</h2>
        <p>Thank you for joining SynCodex! We're excited to have you on board.</p>
        <p>Start exploring and coding now.</p>
        <p>Happy Coding! 🚀</p>
      `,
    });

    console.log(`✅ Welcome email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email Sending Error:", error.message);
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user from Firestore
    const userRef = db.collection("users").doc(email);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(400).json({ message: "User not found" });
    }

    const userData = userSnap.data();

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: userData.email }, "your_jwt_secret", {
      expiresIn: "2d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { fullName: userData.fullName, email: userData.email },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
