const express = require("express");
const cors = require("cors");
const http = require("http");

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);

app.use(cors());

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
