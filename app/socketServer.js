const socketIO = require('socket.io');
const socketIOJwt = require('socketio-jwt');
const models = require('./models');
const jwt = require('jsonwebtoken')
module.exports = {
  up: function (server) {
    const io = socketIO(server);

    // Chat
    const chatNamespace = io.of('/chat');
    // chatNamespace.use(function (socket, next) {
    //   if (socket.handshake.query && socket.handshake.query.token) {
    //     jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
    //       if (err) return next(new Error('Authentication error'));
    //       socket.decoded = decoded;
    //       next();
    //     });
    //   }
    //   else {
    //     next(new Error('Authentication error'));
    //   }
    // }).on('connection', socket => {
    //   socket.on('private-connected', (name) => {
    //     console.log(socket.decoded)
    //   })


    // })

    // chatNamespace
    //   .on('connection', socketIOJwt.authorize({
    //     secret: process.env.JWT_SECRET
    //   }))
    //   .on('authenticated', (socket) => {
    //     //this socket is authenticated, we are good to handle more events from it.
    //     console.log(`hello! ${socket.decoded_token}`);
    //   });
    // chatNamespace.clients((error, clients) => {
    //   if (error) throw error;
    //   console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
    // });

    chatNamespace.on(
      'connection',
      socketIOJwt.authorize({
        secret: process.env.JWT_SECRET
      })
    );
    const users = {}
    const rooms = { 'first-year': { users: {} }, 'second-year': { users: {} } }
    chatNamespace.on('authenticated', async function (socket) {
      const { userId, userRole } = socket.decoded_token;
      // here you put what inside private-connected
      // users[userId] = socket.id
      // console.log(users)

      socket.on('private-connected', (name) => {
        // socket.join(`client ${name}`);
        users[name] = socket.id
        // console.log(users)
      })
      socket.on('private', (msg, toName, personName, personImageUrl, personId, toId, Date1) => {
        socket.to(users[toName]).emit('private', msg, personName, personImageUrl)
        // socket.to(`client ${toName}`).emit('private', msg, personName, personImageUrl)
        // socket.emit('test', { msg: 'remah' }) // if you want to send to yourself
      })

      socket.on('new-user', (room, name, imageUrl) => {
        // ignore {except you want to handle logout}
        rooms[room].users[socket.id] = name
        console.log(rooms)
        socket.join(room)
        chatNamespace.to(room).emit('user-connected', name, imageUrl); // if you called socket => broadcast , so socket not recieve the message
        // io don't work (I think because no one in default namespace)
      })

      socket.on('chat', data => {
        const newMsg = {
          personName: data.personName,
          personImageUrl: data.personImageUrl,
          message: data.msg,
          roomName: data.roomName,
          Date: data.Date1,
          type: data.msg.search('http') != -1 && data.msg.indexOf('http') == 0 ? 'link' : 'text'
        }
        chatNamespace.to(data.roomName).emit('chat', newMsg);
      });

    });

    return io;
  }
};
