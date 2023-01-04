const express = require("express");
const cors = require("cors");
const http = require("http");
const { createRoomHandler } = require("./handlers");

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

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
  socket.on("create-room", (room) => {
    createRoomHandler(room, socket);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
