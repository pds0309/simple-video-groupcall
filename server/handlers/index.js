const { v4: uuidv4 } = require("uuid");

let roomList = [];
let connectedUserList = [];

const createRoomHandler = (room, socket) => {
  const roomId = uuidv4();

  const newUser = {
    userId: room.hostId,
    userNickname: room.hostNickname,
  };
  const newRoom = {
    roomId: roomId,
    roomTitle: room.roomTitle,
    maxCount: room.maxCount,
    hostId: room.hostId,
    hostNickname: room.hostNickname,
  };
  roomList = [...roomList, newRoom];
  connectedUserList = [...connectedUserList, newUser];

  socket.join(roomId);
  socket.emit("room-id", { roomId });
  socket.broadcast.emit("create-room", { data: newRoom });
  console.log("방 생성됨", roomId);
  console.log("현재 방들:", roomList);
  console.log("현재 유저들:", connectedUserList);
};

module.exports = {
  createRoomHandler,
};
