import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.log(error.message);
  }
};

export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    const guestCount = parseInt(guests);
    if (isNaN(guestCount) || guestCount < 1) {
      return res.json({ success: false, message: "Invalid number of guests" });
    }

    const isAvailable = await checkAvailability({
      room,
      checkInDate,
      checkOutDate,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room not available" });
    }

    const roomData = await Room.findById(room).populate("hotel");

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Calculate difference in time
    const timeDiff = checkOut.getTime() - checkIn.getTime();

    // Convert time difference to number of nights
    let nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // Ensure at least 1 night
    nights = Math.max(nights, 1);

    // Final total price
    const pricePerNight = roomData.pricePerNight || 0;
    const totalPrice = pricePerNight * nights;
    const newBooking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      checkInDate,
      checkOutDate,
      totalPrice,
      guests: guestCount,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: req.user.email,
      subject: "Hotel Booking Details",
      html: `
       <h2>Your Booking Details</h2>
       <p>Dear ${req.user.username}, </p>
       <p>Thank you for your booking! here your details</p>
       <ul>
         <li><strong>Booking ID :</strong> ${newBooking._id}</li>
         <li><strong>Hotel Name :</strong> ${roomData.hotel.name}</li>
         <li><strong>Location :</strong> ${roomData.hotel.address}</li>
         <li><strong>Date :</strong> ${newBooking.checkInDate.toDateString()}</li>
         <li><strong>Total Amount :</strong> ${process.env.CURRENCY || "$"} ${
        newBooking.totalPrice
      }</li>

       </ul>
       <p>We look forward to welcome you!</p>
       <p>If you need to make any changes,feel free to contact us.</p>
       `,
    };

    console.log("Attempting to send booking email...");

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.log("Email failed to send:", emailError.message);
      // Optional: You could log this or notify an admin
    }

    console.log("Email sent successfully.");

    res.json({ success: true, message: "Booking Successfull", newBooking });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId })
      .populate("room")
      .populate("hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Failed to fetch details" });
  }
};

export const getHotelBookingDetails = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: req.auth.userId });
    if (!hotel) {
      return res.json({ success: false, message: "No hotel found" });
    }
    const hotelBookings = await Booking.find({ hotel: hotel._id })
      .populate("hotel")
      .populate("room")
      .populate("user")
      .sort({ createdAt: -1 });
    const totalBookings = hotelBookings.length;
    const totalRevenue = hotelBookings.reduce(
      (acc, booking) => acc + booking.totalPrice,
      0
    );
    res.json({
      success: true,
      dashboardData: hotelBookings,
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch Bookings" });
  }
};
