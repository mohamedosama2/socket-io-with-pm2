const $baseCtrl = require("../$baseCtrl");
const APIResponse = require("../../utils/APIResponse");
// const amqp = require("amqplib/callback_api");
// const {
//   openRabbitMqConnection,
//   puplishMqMessages,
// } = require("../../services/rabbit/rabbitFuctions");
// const {
//   QUEEUE_TYPE1,
//   QUEEUE_TYPE2,
//   CONNECTION_NAME1,
// } = require("../../services/rabbit/rabbitVars");

module.exports = $baseCtrl(async (req, res) => {
  // let channel = await amqpConn.createConfirmChannel();

  console.log("Published a request message, requestId:", requestId);
  await publishToChannel(req.competitionChannel, {
    routingKey: "notification",
    exchangeName: "",
    data: req.body.data,
  });

  return APIResponse.Ok(res, "SENT SUCCESSFULLY");
});
function publishToChannel(channel, { routingKey, exchangeName, data }) {
  return new Promise((resolve, reject) => {
    channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(data), "utf-8"),
      { persistent: true },
      function (err, ok) {
        if (err) {
          return reject(err);
        }

        resolve();
      }
    );
  });
}
