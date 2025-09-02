// routes/offerRoute.js
import express from "express";
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
} from "../controllers/offerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminOnly.js";

const offerRouter = express.Router();

// Admin-only routes
offerRouter.post("/", protect, adminOnly, createOffer);
offerRouter.put("/:id", protect, adminOnly, updateOffer);
offerRouter.delete("/:id", protect, adminOnly, deleteOffer);

// Public routes
offerRouter.get("/", getAllOffers);
offerRouter.get("/:id", getOfferById);

export default offerRouter;
