const { v4: uuidv4 } = require("uuid");
const { rooms, users } = require("../constants");

let roomList = rooms().getList();
let connectedUserList = users().getList();

const createRoomHandler = (room, socket) => {
  const roomId = uuidv4();

  const newUser = {
    userId: room.hostId,
    userNickname: room.hostNickname,
    socketId: socket.id,
    roomId,
  };
  const newRoom = {
    roomId: roomId,
    roomTitle: room.roomTitle,
    maxCount: room.maxCount,
    hostId: room.hostId,
    hostNickname: room.hostNickname,
    connectedUserList: [newUser],
  };
  roomList = [...roomList, newRoom];
  connectedUserList = [...connectedUserList, newUser];

  socket.join(roomId);
  socket.emit("room-id", { roomId });
  socket.emit("room-update", { connectedUserList: newRoom.connectedUserList });
  console.log("방 생성됨", roomId);
  console.log("현재 방들:", roomList);
  console.log("현재 유저들:", connectedUserList);
  socket.broadcast.emit("rooms-all", { data: roomList });
};

const joinRoomHandler = (data, socket) => {
  const roomId = data.roomId;
  const newUser = {
    userId: socket.id,
    userNickname: data.userNickname,
    socketId: socket.id,
    roomId,
  };
  const room = roomList.find((room) => room.id === roomId);
  room.connectedUserList = [...room.connectedUserList, newUser];
  connectedUserList = [...connectedUserList, newUser];
  socket.join(roomId);

  room.connectedUsers.forEach((user) => {
    if (user.socketId !== socket.id) {
      const data = {
        connUserSocketId: socket.id,
      };
      // for rtc
      io.to(user.socketId).emit("user-connection-prepared", data);
    }
  });
  io.to(roomId).emit("room-update", { connectedUserList: room.connectedUsers });
  socket.broadcast.emit("rooms-all", { data: roomList });
};

const welcomeEmitRoomList = (socket) => {
  socket.emit("rooms-all", { data: roomList });
};

module.exports = {
  createRoomHandler,
  joinRoomHandler,
  roomList,
  connectedUserList,
  welcomeEmitRoomList,
};
