import io from "socket.io-client";
import { useSelector } from "react-redux";

export default io(import.meta.env.VITE_SERVER_SOCKET_URL as string, {
  transports: ["websocket"],
  reconnection: false,
  // reconnection: true,
  // reconnectionAttempts: 10,
  // reconnectionDelay: 1000,
  // upgrade: false,
  // rejectUnauthorized: false,
  // query: {
  //   token: accessToken,
  // },
});
