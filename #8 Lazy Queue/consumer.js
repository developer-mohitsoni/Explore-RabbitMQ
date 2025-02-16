import amqp from "amqplib";

const consumeMessages = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "lazy_notifications_queue";

    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-queue-mode": "lazy",
      },
    });

    console.log(`Waiting for messages in ${queue}`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log(`Received message: ${message}`);

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Error consuming messages: ", err);
  }
};

consumeMessages();
