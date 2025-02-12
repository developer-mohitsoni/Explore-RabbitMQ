import amqp from "amqplib";

const consumeLiveStreamNotifications = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "headers_exchange";
    const exchangeType = "headers";

    // Bind the queue to the exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    // Declare a queue

    // To avoid race condition, we declare the queue as exclusive. This ensures that the queue will be created only once.

    // Note: The queue name is not provided here, RabbitMQ will generate a unique name for each consumer.
    const q = await channel.assertQueue("", { exclusive: true });

    console.log("Waiting for new video notification ");

    // Bind the queue to the exchange
    await channel.bindQueue(q.queue, exchange, "", {
      "x-match": "all",
      "notification-type": "live_stream",
      "content-type": "gaming",
    });

    channel.consume(q.queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received Live Stream Notification", message);

        // Process the notification
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
  }
};

consumeLiveStreamNotifications();
