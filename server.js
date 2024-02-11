const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/Pages", "index.html"));
});

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.username = username;
    socket.broadcast.emit("update", username + " joined the conversation");
  });

  socket.on("chat", function (message) {
    socket.broadcast.emit("chatmessage", message);
  });

  socket.on("exituser", function () {
    io.emit("userleft", socket.username);
  });
});

const PORT = process.env.PORT || 7004;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
