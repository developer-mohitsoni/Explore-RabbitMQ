import amqp from "amqplib";

async function recvMail() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "mail_queue";
    await channel.assertQueue(queueName, { durable: false });

    channel.consume(queueName, (message) => {
      if (message != null) {
        console.log("Received Message :", JSON.parse(message.content));
        channel.ack(message); // Acknowledge the message to RabbitMQ
      }
    });
  } catch (err) {
    console.error(err);
  }
}

recvMail();
