const express = require("express");
const cors = require("cors");
const http = require("http");
const { rooms, users } = require("./constants");
const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const { v4: uuidv4 } = require("uuid");

app.use(cors());

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("연결됨");
  socket.emit("welcome");
  welcomeEmitRoomList(socket);

  socket.on("create-room", (room) => {
    createRoomHandler(room, socket);
  });
  socket.on("enter-room", (data) => {
    joinRoomHandler(data, socket);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

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

  const room = roomList.find((room) => room.roomId === roomId);
  if (socket.id !== room.hostId) {
    room.connectedUserList = [...room.connectedUserList, newUser];
    connectedUserList = [...connectedUserList, newUser];
    socket.join(roomId);
  }

  room.connectedUserList.forEach((user) => {
    if (user.socketId !== socket.id) {
      const data = {
        connUserSocketId: socket.id,
      };
      // for rtc
      io.to(user.socketId).emit("user-connection-prepared", data);
    }
  });
  io.to(roomId).emit("room-update", {
    connectedUserList: room.connectedUserList,
  });
  socket.broadcast.emit("rooms-all", { data: roomList });
  console.log("방 참가", roomId + "에", data.userNickname + "님이 입장");
};

const welcomeEmitRoomList = (socket) => {
  socket.emit("rooms-all", { data: roomList });
};
