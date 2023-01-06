import { useCallback, useEffect, useState } from "react";

import { Socket } from "socket.io-client";
import { useAppSelector } from "../store/hooks";

const useSocket = () => {
  const mediaUser = useAppSelector((state) => state.mediaUser);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (mediaUser.socket) {
      setSocket(mediaUser.socket);
    }
  }, [mediaUser.socket]);

  const init = useCallback(() => {
    if (!socket) {
      console.log("소켓 사용 불가능");
      return;
    }
    socket.on("welcome", () => {
      console.log("소켓연결됨");
    });
  }, [socket]);

  // TODO: add exception handling
  const emit = useCallback(
    (event: string, ...args: any[]) => {
      socket?.emit(event, ...args);
    },
    [socket]
  );

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      socket?.on(event, callback);
    },
    [socket]
  );

  const off = (event: string) => {
    socket?.off(event);
  };

  return { socket, init, emit, on, off };
};

export default useSocket;
