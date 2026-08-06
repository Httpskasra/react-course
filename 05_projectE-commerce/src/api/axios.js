import axios from "axios";

const api = axios.create({
  baseURL: " https://class-api-server.httpskasra.workers.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
