import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null)

export function SocketProvider({children}) {
    const [socket, setSocket] = useState(() => io())

    // useEffect(() => {
    //     const socket = io()
    //     socket.on('connect', () => {
    //         setSocket(socket)
    //     })
    // }, [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}


export function useSocket() {
    const socket = useContext(SocketContext)
    return socket
}