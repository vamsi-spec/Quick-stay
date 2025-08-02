import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const { user } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [isowner, setIsOwner] = useState(false);
  const [showreg, setShowReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/room/", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setRooms(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: ` Bearer ${await getToken()}` },
      });
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchCities);
      } else {
        setTimeout(() => {
          fetchUser();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  const value = {
    currency,
    user,
    getToken,
    isowner,
    setIsOwner,
    showreg,
    setShowReg,
    axios,
    navigate,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
