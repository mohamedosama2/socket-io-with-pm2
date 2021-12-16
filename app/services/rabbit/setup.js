const amqp = require("amqplib");

// RabbitMQ connection string
const messageQueueConnectionString = process.env.CLOUD_AMQP;
async function setup() {
  // console.log('Setting up RabbitMQ Exchanges/Queues');
  // connect to RabbitMQ Instance
  let connection = await amqp.connect(messageQueueConnectionString);

  // create a channel
  let channel = await connection.createChannel();

  // create queues
  await channel.assertQueue("notification", { durable: true });
  await channel.assertQueue("order", { durable: true });
  await channel.assertQueue("signUp", { durable: true });

  // console.log('Setup DONE');
  await connection.close();
  require("../rabbit");
}

setup();
