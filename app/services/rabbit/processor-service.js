const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), "../.env") });
const amqp = require("amqplib/callback_api");
const { openRabbitMqConnection, consumeMessages } = require("./rabbitFuctions");
const { QUEEUE_1, QUEEUE_2 } = require("./rabbitVars");

async function listenForMessages() {
  console.log("consumer begain");
  openRabbitMqConnection(amqp, async (amqpConn) => {
    let channel = await amqpConn.createChannel();
    await channel.prefetch(1);

    await consumeMessages({ amqpConn, channel }, processMessage, QUEEUE_1);
    await consumeMessages({ amqpConn, channel }, processMessage1, QUEEUE_2);
    console.log("2");
  });
}

function processMessage(requestData) {
  //////////////////processinig
  console.log("henaaa");
}
function processMessage1(requestData) {
  //////////////////processinig
  console.log("henaaa2");
}

module.exports = listenForMessages;
