import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "https://cashorcras-backend.onrender.com", { 
  transports: ["websocket"],
  withCredentials: true
});

export default socket;




