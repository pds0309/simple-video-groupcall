import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { RoomType } from "../types";
import styled from "styled-components";
import useSocket from "../hooks/useSocket";

const RoomList = () => {
  const { on } = useSocket();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  useEffect(() => {
    on("rooms-all", ({ data }) => setRooms(data));
  }, [on]);

  return (
    <RoomListLayout>
      {rooms.map((room) => (
        <RoomCard key={room.roomId}>
          <Link to={"/room/" + room.roomId}>들가기</Link>
          <p>방장: {room.hostNickname}</p>
          <p>
            현재 인원: {room.connectedUserList.length} / {room.maxCount}
          </p>
        </RoomCard>
      ))}
    </RoomListLayout>
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
