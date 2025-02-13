import amqp from "amqplib";

const sendMessage = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "priority_exchange";
    const queue = "priority_queue";
    const routingKey = "priority_key";

    // Type of exchange
    const exchangeType = "direct";

    await channel.assertExchange(exchange, exchangeType, { durable: true });
    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-max-priority": 10, // Set maximum priority to 10
      },
    });

    await channel.bindQueue(queue, exchange, routingKey);

    const data = [
      {
        msg: "Hello Low: 1",
        priority: 1,
      },
      {
        msg: "Hello Hight: 8",
        priority: 8,
      },
      {
        msg: "Hello Mid: 2",
        priority: 2,
      },
    ];

    data.map((msg) => {
      channel.publish(exchange, routingKey, Buffer.from(msg.msg), {
        priority: msg.priority,
      });
    });

    console.log("All messages sent: ");

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

sendMessage();
