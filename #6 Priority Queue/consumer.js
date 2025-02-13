import amqp from "amqplib";

//! NOTE:- If a consumer connects to an empty priority queue to which messages are subsequently published, the messages may not spend any time waiting in the priority queue before the consumer accepts these messages (all the messages are accepted immediately). In this scenario, the priority queue does not get any opportunity to prioritise the messages, priority is not needed.

const consumeMessages = async () => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "priority_queue";

    await channel.assertQueue(queue, {
      durable: true,
      arguments: {
        "x-max-priority": 10,
      },
    });

    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message = msg.content.toString();
        console.log("Received: ", message);

        // Process the notification
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Error consuming messages: ", err);
  }
};

consumeMessages();
