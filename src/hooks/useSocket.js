import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
  const socketRef = useRef(null);

  useEffect(() => {
    // Auto transport select, no websocket forced
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.log("Socket connect error:", err.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return socketRef.current;
}
