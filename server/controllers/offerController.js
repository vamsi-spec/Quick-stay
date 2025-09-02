// controllers/offerController.js

import Hotel from "../models/Hotel.js";
import Offer from "../models/Offer.js";
import Room from "../models/Room.js";

// @desc Create a new offer
// @route POST /api/offers
// @access Admin
export const createOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      discountPercentage,
      hotel,
      room,
      startDate,
      endDate,
    } = req.body;

    if (!title || !discountPercentage || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Validate hotel
    const hotelExists = await Hotel.findById(hotel);
    if (!hotelExists) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Validate room
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: "Room not found" });
    }

    const offer = new Offer({
      title,
      description,
      discountPercentage,
      hotel,
      room,
      startDate,
      endDate,
    });

    const savedOffer = await offer.save();
    res.status(201).json(savedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all offers
// @route GET /api/offers
// @access Public
export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find()
      .populate("hotel", "name location")
      .populate("room", "name type price");

    res.status(200).json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get offer by ID
// @route GET /api/offers/:id
// @access Public
export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate("hotel", "name location")
      .populate("room", "name type price");

    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(offer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update an offer
// @route PUT /api/offers/:id
// @access Admin
export const updateOffer = async (req, res) => {
  try {
    const { hotel, room } = req.body;

    // Validate hotel if provided
    if (hotel) {
      const hotelExists = await Hotel.findById(hotel);
      if (!hotelExists) {
        return res.status(404).json({ message: "Hotel not found" });
      }
    }

    // Validate room if provided
    if (room) {
      const roomExists = await Room.findById(room);
      if (!roomExists) {
        return res.status(404).json({ message: "Room not found" });
      }
    }

    const updatedOffer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json(updatedOffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete an offer
// @route DELETE /api/offers/:id
// @access Admin
export const deleteOffer = async (req, res) => {
  try {
    const deletedOffer = await Offer.findByIdAndDelete(req.params.id);

    if (!deletedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.status(200).json({ message: "Offer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
