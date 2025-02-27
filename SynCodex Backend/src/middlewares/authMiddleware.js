import admin from "../config/firebase.js"; // Firebase Admin SDK

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]; // Extract the token from the Authorization header

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify the token using Firebase Admin
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken; // Attach the decoded token to the request object

        next(); // Move to the next middleware or controller
    } catch (error) {
        return res.status(403).json({ message: "Forbidden: Invalid token", error: error.message });
    }
};

export default verifyToken;
