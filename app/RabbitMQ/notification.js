const amqp = require("amqplib");
const models = require("../models");
// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUD_AMQP;

let connection;

async function connect() {
  connection = await amqp.connect(messageQueueConnectionString);
  listenForMessages();
}

async function listenForMessages() {
  // create a channel and prefetch 1 message at a time
  let channel = await connection.createChannel();
  await channel.prefetch(1);

  // start consuming messages
  console.log("consume");
  await consume({ connection, channel });
}

// consume messages from RabbitMQ
function consume({ connection, channel }) {
  return new Promise((resolve, reject) => {
    channel.consume("notification", async function (msg) {
      // parse message
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);

      // send notification
      await sendNotification(data);

      // acknowledge message as processed successfully
      await channel.ack(msg);
    });

    // handle connection closed
    connection.on("close", async (err) => {
      console.log("close in notification");
      connect();
    });

    // handle errors
    connection.on("error", (err) => {
      console.log("error in notification", err);
    });
  });
}

connect();

const sendNotification = async (data) => {
  try {
    // Send Notification
    // const clients = await models._user.find(data.query);
    // const targetUsers = clients.map((user) => user.id);
    // const notification = await new models.notification({
    //   title: data.title,
    //   body: data.body,
    //   titleAr: data.titleAr,
    //   bodyAr: data.bodyAr,
    //   titleEn: data.titleEn,
    //   bodyEn: data.bodyEn,
    //   user: data.user,
    //   targetUsers: targetUsers,
    //   subjectType: data.subjectType,
    //   subject: data.subject,
    // }).save();

    // const receivers = clients;
    // for (let i = 0; i < receivers.length; i++) {
    //   await receivers[i].sendNotification(
    //     notification.toFirebaseNotification()
    //   );
    // }
    console.log(data);
    console.log("consumed");
  } catch (error) {
    console.log(error);
  }
};
