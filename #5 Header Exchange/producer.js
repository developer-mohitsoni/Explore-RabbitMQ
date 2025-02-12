import amqp from "amqplib";

const sendNotification = async (headers, message) => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "headers_exchange";

    // Type of exchange
    const exchangeType = "headers";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const buffer = Buffer.from(message);

    // Publish the message to the exchange
    channel.publish(exchange, "", buffer, {
      persistent: true,
      headers: headers,
    });

    console.log("Sent Notification with headers: ");

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

// Example usage

const header1 = {
  "x-match": "all",
  "notification-type": "new_video",
  "content-type": "video",
};

sendNotification(header1, "New music video uploaded");

const header2 = {
  "x-match": "all",
  "notification-type": "live_stream",
  "content-type": "gaming",
};

sendNotification(header2, "Gaming live stream started");

const header3 = {
  "x-match": "any",
  "notification-type-comment": "comment",
  "content-type": "vlog",
};

sendNotification(header3, "New comment on your vlog");

const header4 = {
  "x-match": "any",
  "notification-type-like": "like",
  "content-type": "vlog",
};

sendNotification(header4, "Someone like your comment");
