import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StartRating from "../components/StartRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const today = new Date().toISOString().split("T")[0];
  const { id } = useParams();
  const { rooms, axios, getToken, navigate } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isAvailability, setIsAvailability] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!rooms.length || !id) return;

    const foundRoom = rooms.find((room) => room._id === id);
    if (!foundRoom) return;

    setRoom(foundRoom);
    setMainImage(foundRoom.images?.[0]);

    // Rating Breakdown
    const breakdown = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: foundRoom.ratings?.filter((r) => r.rating === star).length || 0,
    }));
    setRatingBreakdown(breakdown);

    // Async token handling
    const checkToken = async () => {
      const token = await getToken();
      if (typeof token === "string" && token.includes(".")) {
        setIsLoggedIn(true);
        try {
          const user = JSON.parse(atob(token.split(".")[1]));
          const existingRating = foundRoom.ratings?.find(
            (r) => r.user === user.id
          );
          if (existingRating) setUserRating(existingRating.rating);
        } catch (err) {
          console.error("Invalid token payload:", err);
        }
      } else {
        setIsLoggedIn(false);
        console.warn("No valid token found.");
      }
    };

    checkToken();
  }, [rooms, id]);

  const checkAvailability = async () => {
    try {
      if (checkInDate >= checkOutDate) {
        toast.error("Please Provide Correct Data timeline");
        return;
      }
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate,
        checkOutDate,
        guests,
      });
      if (data.success) {
        if (data.isAvailable) {
          setIsAvailability(true);
          toast.success("Room is Available");
        } else {
          setIsAvailability(false);
          toast.error("Room is not Available");
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      if (!isAvailability) {
        return checkAvailability();
      } else {
        const { data } = await axios.post(
          "/api/bookings/book",
          { room: id, checkInDate, checkOutDate, guests },
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
        if (data.success) {
          toast.success(data.message);
          navigate("/my-bookings");
          scrollTo(0, 0);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRoomRating = async (value) => {
    if (!isLoggedIn) {
      toast.error("Please login to rate");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/room/rate",
        { roomId: room._id, rating: value },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success("Rating submitted");
        setUserRating(value);
        setRoom((prev) => ({
          ...prev,
          averageRating: data.averageRating,
          ratings: data.ratings, // update full list
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to rate room");
    }
  };

  return (
    room && (
      <div className="py-35 px-16">
        <div className="flex flex-row items-center gap-2 ">
          <h1 className="text-4xl font-playfair">
            {room.hotel.name}{" "}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full ">
            20% OFF
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <StartRating initialRating={room.averageRating || 0} />
          <p className="ml-2 text-sm text-gray-600">
            {room.ratings?.length || 0} Reviews
          </p>
        </div>

        <div className="mt-2 space-y-1 text-sm text-gray-500">
          {ratingBreakdown.map(({ star, count }) => (
            <p key={star}>
              {star} ★ - {count} review{count !== 1 ? "s" : ""}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="" />
          <span>{room.hotel.address}</span>
        </div>
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              className="w-full rounded-xl shadow-lg object-cover"
              alt=""
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  src={image}
                  alt=""
                  key={index}
                  onClick={() => setMainImage(image)}
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img src={facilityIcons[item]} alt="" className="w-5 h-5" />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-2xl font-medium">${room.pricePerNight}/night</p>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <p className="text-l font-medium">Rate this Room</p>
          <StartRating
            initialRating={userRating}
            onRate={handleRoomRating}
            disabled={!isLoggedIn}
          />
          {!isLoggedIn && (
            <p className="text-sm text-gray-500">
              Please login to submit a rating.
            </p>
          )}
        </div>

        <form
          onSubmit={onSubmitHandler}
          className="flex flex-wrap lg:flex-nowrap items-end justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl gap-4"
        >
          {/* Input Fields Group */}
          <div className="flex flex-row flex-wrap items-end gap-4 text-gray-500">
            <div className="flex flex-col mr-12">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                onChange={(e) => setCheckInDate(e.target.value)}
                value={checkInDate || ""}
                min={today}
                className="w-full rounded border border-gray-400 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="flex flex-col mr-12">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                onChange={(e) => setCheckOutDate(e.target.value)}
                value={checkOutDate || ""}
                min={checkInDate}
                disabled={!checkInDate}
                className="w-full rounded border border-gray-400 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                onChange={(e) => setGuests(Number(e.target.value))}
                value={guests}
                placeholder="1"
                className="w-full max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>

          {/* Book Now Button */}
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md px-28 cursor-pointer  py-4 font-semibold text-lg"
          >
            {isAvailability ? "Book Now" : "Check Availability"}
          </button>
        </form>

        <div className="flex flex-col gap-4 mt-18 px-28">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-1.5">
              <img src={spec.icon} alt="" className="w-6.5" />
              <div className="flex flex-col gap-2">
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className=" px-20 max-w-5.2xl border-y border-gray-300 my-15  py-10 text-gray-500">
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get a comfortable Two bedroom apartment has a true
            city feeling. The price quoted is for two guest, at the guest slot
            please mark the number of guests to get the exact price for groups.
            The Guests will be allocated ground floor according to availability.
            You get the comfortable two bedroom apartment that has a true city
            feeling.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={room.hotel.owner.image}
              alt=""
              className="h-16 w-16 rounded-full "
            />
            <div>
              <p className="text-xl">Hosted by {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StartRating />
                <p className="ml-2">200+ reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
            Contact Now
          </button>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
