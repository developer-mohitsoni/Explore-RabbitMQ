import amqp from "amqplib";

async function sendMail() {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "mail_exchange";

    // Bind the queue to the exchange
    const routingKeyForSubUser = "send_mail_to_subscribed_users";
    const routingKeyForNormalUser = "send_mail_to_users";

    // Define the message payload as a JSON object
    const message = {
      to: "mohit@gmail.com",
      from: "normalUser@gmail.com",
      subject: "Test Mail",
      body: "This is a test email.",
    };
    const buffer = Buffer.from(JSON.stringify(message));
    // Publish the message to the exchange

    // What the durable here:-
    // - If the queue is marked as durable, RabbitMQ will ensure that the queue exists even if the server restarts.
    // - If the queue is not marked as durable, RabbitMQ will delete the queue when all consumers have finished using it.
    await channel.assertExchange(exchange, "direct", { durable: false });

    // Declare a queue
    const subscribedUserQueue = "subscribed_user_mail_queue";
    const normalUserQueue = "users_mail_queue";

    await channel.assertQueue(subscribedUserQueue, { durable: false });
    await channel.assertQueue(normalUserQueue, { durable: false });

    // Bind the queue to the exchange
    await channel.bindQueue(
      subscribedUserQueue,
      exchange,
      routingKeyForSubUser
    );

    await channel.bindQueue(normalUserQueue, exchange, routingKeyForNormalUser);

    // Publish a message to the queue
    channel.publish(exchange, routingKeyForNormalUser, buffer);
    console.log("Mail data was sent ", message);

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
}

sendMail();
