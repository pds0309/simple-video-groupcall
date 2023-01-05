import { useEffect, useState } from "react";

import { RoomType } from "../types";
import styled from "styled-components";
import { useNavigate } from "react-router";
import useSocket from "../hooks/useSocket";

const RoomList = () => {
  const navigate = useNavigate();
  const { on } = useSocket();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [name, setName] = useState<string>("");
  useEffect(() => {
    on("rooms-all", ({ data }) => setRooms(data));
  }, [on]);

  const handleLinkClick = (room: RoomType) => {
    navigate("/room/" + room.roomId + "?nickname=" + name);
  };

  return (
    <>
      <input
        style={{ marginBottom: "20px" }}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="닉네임입력"
      />
      <br />
      <RoomListLayout>
        {rooms.map((room) => (
          <RoomCard key={room.roomId}>
            <button onClick={() => handleLinkClick(room)}>들가기</button>
            <p>방장: {room.hostNickname}</p>
            <p>
              현재 인원: {room.connectedUserList.length} / {room.maxCount}
            </p>
          </RoomCard>
        ))}
      </RoomListLayout>
    </>
  );
};

const RoomListLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  grid-column-gap: 16px;
  grid-row-gap: 16px;
`;

const RoomCard = styled.div`
  border-radius: 10px;
  border: 1px solid black;
  padding: 10px;
  min-width: 200px;
`;

export default RoomList;
