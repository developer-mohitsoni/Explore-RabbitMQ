import amqp from "amqplib";

const setup = async (message) => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "notifications_exchange";
    const queue = "lazy_notifications_queue";
    const routingKey = "notifications.key";

    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-queue-mode": "lazy",
      },
    });

    await channel.bindQueue(queue, exchange, routingKey);

    channel.publish(exchange, routingKey, Buffer.from(message), {
      persistent: true,
    });

    console.log(`Message sent: ${message}`);

    await channel.close();
    await connection.close();
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

setup("Hello I'm Mohit Soni");
