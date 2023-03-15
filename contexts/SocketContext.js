import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

const url = process.env.NEXT_PUBLIC_BASE_URL || "192.168.0.105:4001";

export function SocketProvider({ children }) {
  const [socket] = useState(() => io(url));

  useEffect(() => {}, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);
  return socket;
}
