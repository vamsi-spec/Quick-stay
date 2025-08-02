import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);

  const { axios, user, getToken, currency } = useAppContext();

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/room/owner/", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setRooms(data.message || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to fetch rooms."
      );
      setRooms([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const toggleAvailability = async (roomId) => {
    // Optimistically toggle the value
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room._id === roomId ? { ...room, isAvailable: !room.isAvailable } : room
      )
    );

    try {
      const { data } = await axios.post(
        "/api/room/toggle-availability/",
        { roomId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
        fetchRooms(); // revert if API failed
      }
    } catch (error) {
      toast.error(error.message || "Toggle failed");
      fetchRooms(); // revert on error
    }
  };

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />
      <p className="text-gray-600 mt-4">All Rooms</p>
      <div className="w-full max-w-3xl text-left border border-gray-400 rounded-lg max-h-80 overflow-y-scroll mt-8 ">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-medium">Name</th>
              <th className="py-3 px-4 text-gray-800 font-medium">Facility</th>
              <th className="py-3 px-4 text-gray-800 font-medium ">
                Price / night
              </th>
              <th className="py-3 px-4 text-gray-800 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {Array.isArray(rooms) && rooms.length > 0 ? (
              rooms.map((item) => (
                <tr key={item._id}>
                  {/* table cells */}
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.roomType}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {item.amenities.join(" , ")}
                  </td>
                  <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                    {currency}
                    {item.pricePerNight}
                  </td>
                  <td className="py-4 px-4 border-t border-gray-400 text-sm text-red-500 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.isAvailable}
                        onChange={() => toggleAvailability(item._id)}
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300"></div>
                      <div className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></div>
                    </label>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 py-6">
                  No rooms available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListRoom;
