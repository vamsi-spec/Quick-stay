/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
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

  const fetchRooms = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/room/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setRooms(data.message);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  }, [getToken]);

  const fetchUser = useCallback(async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setIsOwner(data.role === "hotelOwner");
        setSearchedCities(data.recentSearchCities || []);
      } else {
        setTimeout(() => fetchUser(), 5000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [getToken]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  useEffect(() => {
    if (user) fetchRooms();
  }, [user, fetchRooms]);

  return (
    <AppContext.Provider
      value={{
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook
export const useAppContext = () => useContext(AppContext);

export default AppContext;
