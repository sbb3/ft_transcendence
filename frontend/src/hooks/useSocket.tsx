import io from "socket.io-client";
import { useSelector } from "react-redux";

const useSocket = () => {
  const accessToken = useSelector((state: any) => state?.auth?.accessToken);
  console.log("socket.io accessToken: ", accessToken);
  const socket = io(import.meta.env.VITE_SERVER_SOCKET_URL as string, {
    transports: ["websocket"],
    reconnection: false,
    // reconnection: true,
    // reconnectionAttempts: 10,
    // reconnectionDelay: 1000,
    // upgrade: false,
    // rejectUnauthorized: false,
    query: {
      token: accessToken,
    },
  });
  return socket;
};

export default useSocket;
