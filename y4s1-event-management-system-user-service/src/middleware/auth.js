const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = { id: decoded.id, role: decoded.role, email: decoded.email };
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token" });
  }
};

const validateTokenForServices = async (req, res, next) => {
  // Same logic as protect, but returns more info for microservices
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      res.json({
        valid: true,
        userId: decoded.id,
        role: decoded.role,
        userEmail: decoded.email,
      });
    } catch (error) {
      res.status(401).json({ valid: false, error: "Invalid token" });
    }
  } else {
    res.status(401).json({ valid: false, error: "No token provided" });
  }
};

module.exports = { protect, validateTokenForServices };
