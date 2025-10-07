import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Call req.auth() instead of using req.auth object
    const auth = req.auth && typeof req.auth === "function" ? req.auth() : null;

    if (!auth || !auth.userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const user = await User.findById(auth.userId);

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
