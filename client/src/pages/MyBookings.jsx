import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import { assets, userBookingsDummyData } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyBookings = () => {
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchUserBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
        toast.success(data.message || "Room Booked successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  return (
    <div className="py-28 pb-32 px-16 ">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks"
        align="left"
      />
      <div className="max-w-6xl mt-8  text-gray-800">
        <div className="grid grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-400 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Payment</div>
        </div>
        {bookings.map((booking) => {
          const room = booking.room;
          const hotel = booking.hotel;

          // Skip this booking if either room or hotel is missing
          if (!room || !hotel) return null;

          return (
            <div
              key={booking._id}
              className="grid grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-400 py-6 first:border-t"
            >
              <div className="flex flex-row">
                <img
                  src={room.images?.[0] || assets.placeholderImage}
                  className="w-44 rounded shadow object-cover"
                  alt="Room"
                />
                <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                  <p className="font-playfair text-2xl">
                    {hotel.name}
                    <span className="font-inter text-sm">
                      {" "}
                      ({room.roomType})
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <img src={assets.locationIcon} alt="location" />
                    <span>{hotel.address}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <img src={assets.guestsIcon} alt="guests" />
                    <span>Guests: {booking.guests}</span>
                  </div>
                  <p className="text-base">Total: ${booking.totalPrice}</p>
                </div>
              </div>

              <div className="flex flex-row item-center gap-12 mt-3">
                <div>
                  <p>Check-In:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-center">
                <div className="flex flex-row items-center gap-2">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      booking.isPaid ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                  <p
                    className={`text-sm ${
                      booking.isPaid ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {booking.isPaid ? "Paid" : "Unpaid"}
                  </p>
                </div>
                {!booking.isPaid && (
                  <button className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-200 transition-all cursor-pointer">
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyBookings;
