import { useAppSelector } from "../store/hooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useSocket from "../hooks/useSocket";

const Room = () => {
  const { id } = useParams();
  const mediaUser = useAppSelector((state) => state.mediaUser);
  const { emit, on } = useSocket();
  useEffect(() => {
    emit("enter-room", { roomId: id, userNickname: mediaUser.userNickname });
  }, [emit, id, mediaUser.userNickname]);

  useEffect(() => {
    on("room-update", (data) => {
      const { connectedUserList } = data;
      console.log(connectedUserList);
    });
  }, [on]);

  return <div></div>;
};

export default Room;
