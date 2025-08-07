import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: { type: String, ref: "Hotel", required: true },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    amenities: { type: Array, required: true },
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },

    ratings: [
      {
        user: { type: String, required: true }, // ← changed from ObjectId to String
        rating: { type: Number, required: true },
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
