const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/cluster-adapter");
const { setupWorker } = require("@socket.io/sticky");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const httpServer = createServer();
const io = new Server(httpServer);

io.adapter(createAdapter());

setupWorker(io);
const namespace = io.of("/chat");

namespace.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(
      socket.handshake.query.token,
      process.env.JWT_SECRET,
      function (err, decoded) {
        if (err) return next(new Error("Authentication error"));
        socket.decoded = decoded;
        next();
      }
    );
  } else {
    next(new Error("Authentication error"));
  }
});

namespace.on("connection", (socket) => {
  socket.on("disconnect", (reason) => {
    console.log("disconnected :", reason);
  });
  socket.on("connect_error", (err) => {
    console.log(err.message); // prints the message associated with the error
  });

  socket.on("error", (err) => {
    console.log(err);
    if (err && err.message === "Authentication error") {
      socket.disconnect();
    }
  });
  console.log(
    `connectected ${socket.id}`,
    "and token  ",
    socket.handshake.query.token,
    "info :",
    socket.decoded
  );
});
