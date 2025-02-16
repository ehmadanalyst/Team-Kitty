const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (role) => {
  return (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) return res.status(401).json({ message: "Access Denied" });

    const token = authHeader.split(" ")[1];   
    if (!token) return res.status(401).json({ message: "Access Denied" });
    console.log("Token: ", token);

    try {
      console.log('Withing try');
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      console.log('After verified');
      req.user = verified;

      if (role && req.user.role !== role) {
        return res.status(403).json({ message: "Forbidden: Access Denied" });
      }

      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
};

module.exports = authMiddleware;
