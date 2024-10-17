import axios from "axios";

const baseurlMap = `${import.meta.env.VITE_API_BASE_URL}/${
  import.meta.env.VITE_API_VERSION
}`;

const instance = axios.create({
  baseURL: baseurlMap || "http://localhost:8000/api/v1",
  withCredentials: true,
});

export default instance;
