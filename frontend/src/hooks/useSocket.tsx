import React from "react";
import io from "socket.io-client";

const useSocket = () => {
  const socket = io(import.meta.env.VITE_API_URL as string, {
    reconnectionDelay: 1000,
    reconnection: true,
    transports: ["websocket"],
    upgrade: false,
    rejectUnauthorized: false,
  });
  return socket;
};

export default useSocket;
