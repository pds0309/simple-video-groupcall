import { Socket, io } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useCallback, useEffect, useState } from "react";

import { initSocket } from "../store/modules/mediaUserSlice";

const useSocket = () => {
  const mediaUser = useAppSelector((state) => state.mediaUser);
  const [socket, setSocket] = useState<Socket>();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!mediaUser.socket) {
      dispatch(initSocket(io("http://localhost:8080")));
      return;
    }
  }, [dispatch, mediaUser.socket]);

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
  const emit = (event: string, ...args: any[]) => {
    socket?.emit(event, ...args);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socket?.on(event, callback);
  };

  const off = (event: string) => {
    socket?.off(event);
  };

  return { socket, init, emit, on, off };
};

export default useSocket;
