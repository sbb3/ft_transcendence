import io from "socket.io-client";

export const createSocketClient = () => {
  return io(import.meta.env.VITE_SERVER_CHAT_SOCKET_URL as string, {
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
};
