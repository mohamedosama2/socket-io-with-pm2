// const amqp = require("amqplib");
// const messageQueueConnectionString = process.env.CLOUD_AMQP;

// // SETUP RABBITMQ :
// let connection;
// // let offerChannel;
// // let competitionChannel;
// let notificationChannel;
// // let signupChannel;
// // let orderChannel;
// async function connect() {
//   connection = await amqp.connect(messageQueueConnectionString);
//   // offerChannel = await connection.createConfirmChannel();
//   // competitionChannel = await connection.createConfirmChannel();
//   notificationChannel = await connection.createConfirmChannel();
//   // signupChannel = await connection.createConfirmChannel();
//   // orderChannel = await connection.createConfirmChannel();
//   connection.on("close", async (err) => {
//     console.log("close in Base");
//     connect();
//     // return reject(err);
//   });
//   connection.on("error", (err) => {
//     console.log("err in Base", err);
//     // return reject(err);
//   });
// }
// connect();

// module.exports = (req, res, next) => {
//   // req.offerChannel = offerChannel;
//   // req.orderChannel = orderChannel;
//   req.notificationChannel = notificationChannel;
//   // req.competitionChannel = competitionChannel;
//   // req.signupChannel = signupChannel;
//   return next();
// };
