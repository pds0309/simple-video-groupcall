const express = require("express");
const cors = require("cors");
const http = require("http");
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

  socket.on("disconnect", () => {
    disconnectHandler(socket);
    console.log("연결끊김");
  });

  socket.on("create-room", (room) => {
    createRoomHandler(room, socket);
  });
  socket.on("enter-room", (data) => {
    joinRoomHandler(data, socket);
  });

  socket.on("leave-room", () => {
    console.log("유저가 방을 나감");
    disconnectHandler(socket);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});

let roomList = [];
let connectedUserList = [];

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
  socket.emit("room-id", { newRoom });
  socket.emit("room-update", {
    connectedUserList: newRoom.connectedUserList,
    currentRoom: newRoom,
  });
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
  if (socket.id !== room?.hostId) {
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
    currentRoom: room,
  });
  socket.broadcast.emit("rooms-all", { data: roomList });
  console.log("방 참가", roomId + "에", data.userNickname + "님이 입장");
};

const disconnectHandler = (socket) => {
  const currentUser = connectedUserList.find(
    (user) => user.socketId === socket.id
  );
  if (!currentUser) {
    console.log("user was not in room!");
    return;
  }

  const room = roomList.find((room) => room.roomId === currentUser.roomId);
  if (!room) {
    return;
  }
  room.connectedUserList =
    room?.connectedUserList.filter((user) => user.socketId !== socket.id) ?? [];
  socket.leave(currentUser.roomId);
  console.log(room.roomId, "방을 ", currentUser.userNickname, "님 이 퇴장");
  // 마지막 녀석이면 방 파괴
  if (room.connectedUserList.length === 0) {
    roomList = roomList.filter((rm) => rm.roomId !== room.roomId);
  } else {
    // 나간애가 방장이면 위임
    if (room.hostId === currentUser.userId) {
      room.hostId = room.connectedUserList[0].userId;
      room.hostNickname = room.connectedUserList[0].userNickname;
      roomList = roomList.map((rm) => (rm.roomId === room.roomId ? room : rm));
    }
    io.to(room.roomId).emit("user-disconnected", { socketId: socket.id });
    io.to(room.roomId).emit("room-update", {
      connectedUserList: room.connectedUserList,
      currentRoom: room,
    });
  }
  socket.broadcast.emit("rooms-all", { data: roomList });
};

const welcomeEmitRoomList = (socket) => {
  socket.emit("rooms-all", { data: roomList });
};
