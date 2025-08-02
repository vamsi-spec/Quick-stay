import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const HotelReg = () => {
  const { setShowReg, axios, setIsOwner, getToken } = useAppContext();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [contact, setContact] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post(
        "/api/hotels/",
        { name, address, city, contact },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowReg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div
      onClick={() => setShowReg(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col md:flex-row bg-white rounded-xl max-w-4xl w-full mx-4"
      >
        <img
          src={assets.regImage}
          className="hidden md:block w-1/2 rounded-l-xl"
          alt="Hotel Registration"
        />
        <div className="relative flex flex-col items-center w-full md:w-1/2 p-10">
          <img
            src={assets.closeIcon}
            alt="Close"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={() => setShowReg(false)}
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          <div className="w-full mt-4">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border border-gray-300 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light w-full"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Phone
            </label>
            <input
              type="text"
              id="contact"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              placeholder="Type here"
              className="border border-gray-300 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light w-full"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              id="address"
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              placeholder="Type here"
              className="border border-gray-300 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light w-full"
              required
            />
          </div>

          <div className="w-full mt-4">
            <label htmlFor="city" className="font-medium text-gray-600">
              City
            </label>
            <select
              onChange={(e) => setCity(e.target.value)}
              value={city}
              id="city"
              className="border border-gray-200 rounded w-full px-3 py-2.5 outline-indigo-500 font-light"
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option value={city} key={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-800 transition-all text-white px-6 py-2 mt-6 mr-auto rounded"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
