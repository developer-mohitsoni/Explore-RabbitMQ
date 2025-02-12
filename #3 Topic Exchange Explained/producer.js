import amqp from "amqplib";

const sendMessage = async (routingKey, message) => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "notification_exchange";

    // Type of exchange
    const exchangeType = "topic";

    await channel.assertExchange(exchange, exchangeType, { durable: false });

    const buffer = Buffer.from(JSON.stringify(message));

    // Publish the message to the exchange
    channel.publish(exchange, routingKey, buffer, { persistent: true });
    console.log("[x] Send '%s':'%s'", routingKey, JSON.stringify(message));
    console.log(
      `Message sent to exchange: ${exchange} with routing key: ${routingKey} and content as ${message}`
    );

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

sendMessage("order.placed", { orderId: 12345, status: "placed" });
sendMessage("payment.processed", { orderId: 67890, status: "processed" });
