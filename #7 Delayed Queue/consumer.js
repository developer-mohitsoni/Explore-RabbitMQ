import amqp from "amqplib";

const processOrderUpdates = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "delayed_order_updates_queue";

    await channel.assertQueue(queue, {
      durable: true,
    });

    channel.consume(
      queue,
      async (batch) => {
        if (batch !== null) {
          const { batchId, orders } = JSON.parse(msg.content.toString());
          console.log(`Processing order update task for batch: ${batchId}`);

          // Update order status for the batch

          await updateOrderStatus(batchId);

          channel.ack(batch);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("Error consuming messages: ", err);
  }
};

const updateOrderStatus = (batchId) => {
  // Simulate order status update
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(
        `Order status updated to "Started Shipping" for batch: ${batchId}`
      );
      resolve();
    }, 1000); // Simulate time taken to update order status
  });
};

processOrderUpdates();
