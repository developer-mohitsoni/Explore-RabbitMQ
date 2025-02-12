import amqp from "amqplib";

async function recvMail() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "notification_exchange";
    const queue = "order_queue";

    // Bind the queue to the exchange
    await channel.assertExchange(exchange, "topic", { durable: false });
    await channel.assertQueue(queue, { durable: false });

    // Bind the queue to the exchange with the pattern "order.*"
    await channel.bindQueue(queue, exchange, "order.*");

    console.log("Waiting for Messages");

    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          console.log(
            `[Order Notification] Msg was consumed! with routing key as ${msg.fields.routingKey} and content as`,
            JSON.parse(msg.content.toString())
          );
          channel.ack(msg);
        }
      },
      // Automatically requeue unacknowledged messages
      { noAck: false }
    );
  } catch (err) {
    console.error("Error: ", err);
  }
}

recvMail();
