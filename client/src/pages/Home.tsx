import { useAppDispatch, useAppSelector } from "../store/hooks";

import RoomList from "../components/RoomList";
import RoomSubmit from "../components/RoomSubmit";
import { initSocket } from "../store/modules/mediaUserSlice";
import { io } from "socket.io-client";
import { useEffect } from "react";
import useSocket from "../hooks/useSocket";

const Home = () => {
  const dispatch = useAppDispatch();
  const mediaUser = useAppSelector((state) => state.mediaUser);
  const { init } = useSocket();

  useEffect(() => {
    console.log("hi");
    dispatch(initSocket(io("http://localhost:8080")));
  }, [dispatch]);

  useEffect(() => {
    if (mediaUser.socket) {
      init();
    }
  }, [mediaUser.socket, init]);

  return (
    <div>
      <RoomSubmit />
      <br />
      <RoomList />
    </div>
  );
};

export default Home;
