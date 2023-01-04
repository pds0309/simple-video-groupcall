import { RoomType } from "../types";
import { useNavigate } from "react-router-dom";
import useSocket from "../hooks/useSocket";
import { useState } from "react";

const RoomSubmit = () => {
  const navigate = useNavigate();
  const { socket, emit, on } = useSocket();
  const [roomTitle, setRoomTitle] = useState<string>("");
  const [userNickname, setUserNickname] = useState<string>("");
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
    on("room-id", (data) => {
      if (data.roomId) {
        navigate("/room/" + data.roomId);
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
