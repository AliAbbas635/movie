import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from Bearer scheme

    if (!authHeader || !token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token not provided.",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token.",
        });
      }

      req.user = decoded; // Store decoded user info in the request object
      next();
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error. " + error.message,
    });
  }
};
