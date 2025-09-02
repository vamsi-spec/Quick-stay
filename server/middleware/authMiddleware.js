import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(req.auth.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user; // Attach user object to request
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};
