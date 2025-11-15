import { useEffect } from "react";
import { socket } from "../socket";

export default function useSocket(boardId, onEvent) {

    useEffect(() => {
        if (!boardId) return;

        // Join board room
        socket.emit("joinBoard", { boardId });

        // Listen for events
        socket.on("realtime:event", onEvent);

        return () => {
            // Leave board room
            socket.emit("leaveBoard", { boardId });
            socket.off("realtime:event", onEvent);
        };
    }, [boardId, onEvent]);
}
