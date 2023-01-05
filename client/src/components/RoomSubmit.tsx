import { useAppDispatch, useAppSelector } from "../store/hooks";

import { RoomType } from "../types";
import { setUserInfo } from "../store/modules/mediaUserSlice";
import { updateAllRooms } from "../store/modules/roomSlice";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { useState } from "react";

const RoomSubmit = () => {
  const navigate = useNavigate();
  const { socket, emit, on } = useSocket();
  const [roomTitle, setRoomTitle] = useState<string>("");
  const [userNickname, setUserNickname] = useState<string>("");
  const rooms = useAppSelector((state) => state.rooms);
  const dispatch = useAppDispatch();
  const maxCount = 5;

  const handleSubmitRoomClick = () => {
    if (!socket || !roomTitle || !userNickname) {
      return;
    }
    const newRoom: RoomType = {
      roomTitle: roomTitle,
      maxCount: maxCount,
      hostId: socket.id,
      hostNickname: userNickname,
      connectedUserList: [],
    };
    emit("create-room", newRoom);
    on("room-id", ({ newRoom }) => {
      if (newRoom.roomId) {
        dispatch(setUserInfo({ userNickname, userId: socket.id }));
        dispatch(updateAllRooms(rooms.allRooms.concat(newRoom)));
        navigate("/room/" + newRoom.roomId);
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
        placeholder="방제목"
      />
      <input
        type="text"
        value={userNickname}
        onChange={(e) => setUserNickname(e.target.value)}
        placeholder="닉네임"
      />
      <button onClick={handleSubmitRoomClick}>방 만들기</button>
    </div>
  );
};

export default RoomSubmit;
