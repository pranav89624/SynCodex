import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js"; // Import Nodemailer Config
import dotenv from "dotenv";
import { db } from "../config/firebase.js";  // ✅ Import the initialized Firestore instance
import crypto from "crypto";

dotenv.config();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

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

    // Generate JWT tokens
    const token = generateToken(userData);
    // const refreshToken = generateRefreshToken(userData);

    // res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 3600000 });
    // res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 604800000 });

    res.json({
      message: "Login successful",
      user: { fullName: userData.fullName, email: userData.email },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Refresh Token
export const refreshToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized - No Refresh Token" });

  try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const newToken = generateToken({ email: decoded.email });
      res.cookie("token", newToken, { httpOnly: true, secure: true, sameSite: "Strict", maxAge: 3600000 });
      res.json({ accessToken: newToken });
  } catch (err) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 3600000; // Token valid for 1 hour

    // Update Firestore with reset token & expiration
    snapshot.forEach(async (doc) => {
      await doc.ref.update({ resetToken, resetTokenExpires });
    });

    // Send reset email
    await sendResetEmail(email, resetToken);

    return res.status(200).json({ message: "Reset email sent successfully" });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const sendResetEmail = async (email, resetToken) => {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset. Click the link below:</p>
           <a target="_blank" href="${resetLink}">${resetLink}</a>
           <p>This link will expire in 1 hour.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("resetToken", "==", token).get();

    if (snapshot.empty) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    snapshot.forEach(async (doc) => {
      await doc.ref.update({
        password: hashedPassword,
        resetToken: null, // Remove the token after reset
        resetTokenExpires: null,
      });
    });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};