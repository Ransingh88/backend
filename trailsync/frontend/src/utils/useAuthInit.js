import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearAuth,
  setAuth,
  setAuthLoading,
} from "../redux/features/auth/authSlice";
import axios from "../config/axiosConfig";

const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch(setAuthLoading());
      try {
        const response = await axios.get("/user/checkAuth");
        if (response.data.success) {
          console.log(response.data, ".....");
          dispatch(setAuth(response.data.data));
        } else {
          dispatch(clearAuth());
        }
      } catch (error) {
        dispatch(clearAuth());
        console.log(error, "jgjygj");
      }
    };
    checkAuthStatus();
  }, [dispatch]);
};

export default useAuthInit;
