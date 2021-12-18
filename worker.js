// const socketIO = require("socket.io");
const socketIOJwt = require("socketio-jwt");
// const models = require("./models");
const jwt = require("jsonwebtoken");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/cluster-adapter");
const { setupWorker } = require("@socket.io/sticky");

const httpServer = createServer();
const io = new Server(httpServer);

io.adapter(createAdapter());

setupWorker(io);
// Chat
const chatNamespace = io.of("/chat");

chatNamespace.on("connection", () => {
  console.log("ssss");
});
const users = {};
const rooms = { "first-year": { users: {} }, "second-year": { users: {} } };
chatNamespace.on("authenticated", async function (socket) {
  const { userId, userRole } = socket.decoded_token;
  // here you put what inside private-connected
  // users[userId] = socket.id
  // console.log(users)

  console.log("Auth");

  console.log(userId, userRole);
  console.log(`listening on *:${800 + process.env.NODE_APP_INSTANCE}`);

  socket.on("private-connected", (name) => {
    // socket.join(`client ${name}`);
    users[name] = socket.id;
    // console.log(users)
  });
  socket.on(
    "private",
    (msg, toName, personName, personImageUrl, personId, toId, Date1) => {
      socket.to(users[toName]).emit("private", msg, personName, personImageUrl);
      // socket.to(`client ${toName}`).emit('private', msg, personName, personImageUrl)
      // socket.emit('test', { msg: 'remah' }) // if you want to send to yourself
    }
  );

  socket.on("new-user", (room, name, imageUrl) => {
    // ignore {except you want to handle logout}
    rooms[room].users[socket.id] = name;
    console.log(rooms);
    socket.join(room);
    chatNamespace.to(room).emit("user-connected", name, imageUrl); // if you called socket => broadcast , so socket not recieve the message
    // io don't work (I think because no one in default namespace)
  });

  socket.on("chat", (data) => {
    const newMsg = {
      personName: data.personName,
      personImageUrl: data.personImageUrl,
      message: data.msg,
      roomName: data.roomName,
      Date: data.Date1,
      type:
        data.msg.search("http") != -1 && data.msg.indexOf("http") == 0
          ? "link"
          : "text",
    };
    chatNamespace.to(data.roomName).emit("chat", newMsg);
  });
});
