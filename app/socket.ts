import { io, Socket } from "socket.io-client";

let socket: Socket;
const SOCKET_PATH = "/api/queue";
export const initializeSocket = (HOST: string, ticketId: string) => {
  socket = io(HOST, {
    // transports: ["websocket"],
    path: SOCKET_PATH,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000,
    withCredentials: true,
    rejectUnauthorized: false,
    extraHeaders: {
      "ticket-id": ticketId,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.log("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
