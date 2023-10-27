import io from "socket.io-client";
import store from "../store";

interface SocketClientProps {
  api_url?: string;
}

export const createSocketClient = ({
  api_url = "http://localhost:5173",
}: SocketClientProps) => {
  let socket;

  socket = io(api_url, {
    transports: ["websocket"],
    reconnection: false,
    // reconnection: true,
    // reconnectionAttempts: 10,
    // reconnectionDelay: 1000,
    // rejectUnauthorized: false,
    query: {
      token: store.getState().auth.accessToken,
      userId: store.getState().auth.userId,
    },
  });

  // socket.setMaxListeners(15);
  return socket;
};
