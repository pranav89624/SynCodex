import bcrypt from "bcryptjs";
import { db } from "../config/firebase.js";
import transporter from "../config/nodemailer.js";

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userEmail = req.user.email;

  try {
    const userRef = db.collection("users").doc(userEmail);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userSnap.data();

    const isMatch = await bcrypt.compare(currentPassword, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRef.update({ password: hashedPassword });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Your SynCodex Password Was Changed",
      html: `
        <h2>Password Change Alert</h2>
        <p>Hey ${userData.fullName || "User"},</p>
        <p>Your SynCodex password was successfully changed.</p>
        <p>If this wasn’t you, please reset your password or contact support immediately.</p>
        <br/>
        <p>– The SynCodex Team</p>
      `
    });

    res.status(200).json({ message: "Password updated successfully and email sent." });
  } catch (err) {
    console.error("Password change error:", err.message);
    res.status(500).json({ error: "Failed to change password" });
  }
};
