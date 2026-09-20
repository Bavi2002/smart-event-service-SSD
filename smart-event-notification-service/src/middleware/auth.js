// src/middleware/auth.js
import jwt from "jsonwebtoken";

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // For now we just verify signature
      // Later you can fetch user from User Service if needed
      req.user = decoded; // { id, role, ... } depending on what your User Service puts in JWT

      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      res.status(401).json({ message: "Not authorized - invalid token" });
    }
  } else {
    res.status(401).json({ message: "Not authorized - no token" });
  }
};

export default protect;
