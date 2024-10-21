import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/features/auth/authSlice";

const baseurlMap = `${import.meta.env.VITE_API_BASE_URL}/${
  import.meta.env.VITE_API_VERSION
}`;

const instance = axios.create({
  baseURL: baseurlMap || "http://localhost:8000/api/v1",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 500 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await instance.post("/user/refreshAccessToken");
        return instance(originalRequest);
      } catch (error) {
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
