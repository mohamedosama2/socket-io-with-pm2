const messageQueueConnectionString = process.env.CLOUDAMQP_URL;

module.exports = {
  openRabbitMqConnection: async function setup(amqp, whenConnected) {
    console.log("Setting up RabbitMQ Exchanges/Queues");
    // connect to RabbitMQ Instance
    await amqp.connect(messageQueueConnectionString, function (err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        setup();
      }
      conn.on("error", function (err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      console.log("[AMQP] connected");

      whenConnected(conn);
    });
  },

  consumeMessages: async function consume(
    { connection, channel },
    processMessage,
    consumerType
  ) {
    channel.consume(consumerType, async function (msg) {
      // parse message
      let msgBody = msg.content.toString();
      let data = JSON.parse(msgBody);
      let requestId = data.requestId;
      let requestData = data.requestData;
      console.log("Received a request message, requestId:", requestId);

      // process data
      processMessage(requestData);

      // acknowledge message as processed successfully
      await channel.ack(msg);
    });
  },

  puplishMqMessages: function publishToChannel(
    channel,
    { routingKey, exchangeName, data }
  ) {
    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(data), "utf-8"),
      { persistent: true },
      function (err, ok) {
        if (err) {
          return err;
        }
      }
    );
  },
};
