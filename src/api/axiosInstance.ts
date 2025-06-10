import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://virtserver.swaggerhub.com/motolink-505/MotolinkAPI/1.0",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;