import { io } from "socket.io-client";

// На Vercel зададим VITE_SERVER_URL в Environment Variables
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3001";

export const socket = io(SERVER_URL, { transports: ["websocket"] });
