import amqp from "amqplib";

const smsNotification = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "new_product_launch";
    const exchangeType = "fanout";

    // Bind the queue to the exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true });

    // Declare a queue

    // To avoid race condition, we declare the queue as exclusive. This ensures that the queue will be created only once.

    // Note: The queue name is not provided here, RabbitMQ will generate a unique name for each consumer.
    const queue = await channel.assertQueue("", { exclusive: true });

    console.log("Waiting for Messages => ", queue);

    // Bind the queue to the exchange
    await channel.bindQueue(queue.queue, exchange, "");

    channel.consume(queue.queue, (msg) => {
      if (msg !== null) {
        const product = JSON.parse(msg.content.toString());
        console.log(`Sending SMS notification for product => ${product.name}`);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Error: ", err);
  }
};

smsNotification();
