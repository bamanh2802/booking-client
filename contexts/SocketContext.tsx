"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { io } from "socket.io-client";
import { Socket } from "@/types/socket"; // Giả sử đường dẫn này đúng
import { SOCKET_PATH } from "@/services/apiPath"; // Import SOCKET_PATH

// Định nghĩa kiểu dữ liệu cho Context value
type SocketContextType = Socket | null;

// Tạo Context với kiểu đã định nghĩa
const SocketContext = createContext<SocketContextType>(null);

// Custom hook để sử dụng trong các component
export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

// Định nghĩa kiểu cho props của Provider
interface SocketProviderProps {
  children: ReactNode;
}

// Provider component
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<SocketContextType>(null);

  useEffect(() => {
    console.log(`[Socket.IO] Attempting to connect to: ${SOCKET_PATH}`);

    // Khởi tạo socket
    const newSocket: Socket = io(SOCKET_PATH, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log(
        `[Socket.IO] ✅ Connected to server with socket ID: ${newSocket.id}`
      );
    });

    newSocket.on("disconnect", (reason) => {
      console.log(`[Socket.IO] ❌ Disconnected from server. Reason: ${reason}`);
    });

    newSocket.on("connect_error", (error) => {
      console.error(`[Socket.IO] ❌ Connection error: ${error.message}`);
    });

    setSocket(newSocket);

    return () => {
      console.log("[Socket.IO] Disconnecting...");
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
