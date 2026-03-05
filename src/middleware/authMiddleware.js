import jwt from "jsonwebtoken";
import User from "../models/User.js";


// 1. Extract token from Authorization header
// 2. Verify token
// 3. Find user
// 4. Attach user to req.user
// 5. Call next()
// 6. If invalid → return 401

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "testsecret";

    const decoded = jwt.verify(token, secret);

    let user = await User.findById(decoded.id);
    if (user && user.password) {
      // remove password field when present
      const u = user.toObject ? user.toObject() : { ...user };
      delete u.password;
      user = u;
    }
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;