import { RoomType, UserType } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RoomJoinedUserList from "../components/RoomJoinedUserList";
import { joinRoom } from "../store/modules/roomSlice";
import useSocket from "../hooks/useSocket";

const Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mediaUser = useAppSelector((state) => state.mediaUser);
  const rooms = useAppSelector((state) => state.rooms);
  const dispatch = useAppDispatch();
  const { emit, on, socket } = useSocket();
  const [currentConnectedUsers, setCurrentConnectedUsers] = useState<
    UserType[]
  >([]);
  useEffect(() => {
    emit("enter-room", { roomId: id, userNickname: mediaUser.userNickname });
  }, [emit, id, mediaUser.userNickname]);

  useEffect(() => {
    on("room-update", (data) => {
      const connectedUserList: UserType[] = data.connectedUserList;
      const room: RoomType = data.currentRoom;
      setCurrentConnectedUsers(connectedUserList);
      dispatch(joinRoom(room));
      console.log(connectedUserList);
    });
  }, [on, dispatch]);

  useEffect(() => {
    return () => emit && emit("leave-room");
  }, [emit]);

  if (!socket) {
    navigate("/");
  }

  return (
    <div>
      <h3>방제: {rooms.currentRoom?.roomTitle}</h3>
      <h4>주인: {rooms.currentRoom?.hostId}</h4>
      <RoomJoinedUserList
        hostId={rooms.currentRoom?.hostId ?? ""}
        userList={currentConnectedUsers}
      />
    </div>
  );
};

export default Room;
