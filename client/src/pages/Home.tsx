import RoomList from "../components/RoomList";
import RoomSubmit from "../components/RoomSubmit";
import { useEffect } from "react";
import useSocket from "../hooks/useSocket";

const Home = () => {
  const { socket, init } = useSocket();

  useEffect(() => {
    if (socket) {
      init();
    }
  }, [socket, init]);

  return (
    <div>
      <RoomSubmit />
      <br />
      <RoomList />
    </div>
  );
};

export default Home;
