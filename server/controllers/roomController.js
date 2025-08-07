import upload from "../middleware/uploadMiddleware.js";
import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";

export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel found" });
    }

    const uploadImages = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path);
      return result.secure_url;
    });

    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room created successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image",
        },
      })
      .sort({ createdAt: -1 });
    res.json({ success: true, message: rooms });
  } catch (error) {
    console.error("getRooms ERROR:", error); // <- this helps
    res.json({ success: false, message: error.message });
  }
};

export const getOwnerRooms = async (req, res) => {
  try {
    const hotelData = await Hotel.findOne({ owner: req.auth.userId });
    const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate(
      "hotel"
    );
    res.json({ success: true, message: rooms });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;
    const roomData = await Room.findById(roomId);
    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();
    res.json({ success: true, message: "Toogled successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const rateRoom = async (req, res) => {
  try {
    const { roomId, rating } = req.body;
    const userId = req.auth.userId;
    if (!roomId || !rating || rating < 1 || rating > 5) {
      return res.json({
        success: false,
        message: "Invalid roomId or rating value",
      });
    }
    console.log("roomId:", roomId);
    console.log("rating:", rating);
    console.log("userId:", userId);
    const room = await Room.findById(roomId);
    if (!room) {
      return res.json({ success: false, message: "Room not found" });
    }
    room.ratings = room.ratings.filter(
      (r) => r.user.toString() !== userId.toString()
    );
    room.ratings.push({ user: userId, rating });
    const total = room.ratings.reduce((sum, r) => sum + r.rating, 0);
    room.averageRating = parseFloat((total / room.ratings.length).toFixed(1));

    await room.save();
    res.json({
      success: true,
      message: "Rating submitted successfully",
      averageRating: room.averageRating,
    });
  } catch (error) {
    console.error("RateRoom Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: " + error.message,
    });
  }
};
