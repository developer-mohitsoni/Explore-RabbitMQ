import amqp from "amqplib";

const announceNewProduct = async (product) => {
  try {
    // Connect to RabbitMQ
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    // Setup Exchange
    const exchange = "new_product_launch";

    // Type of exchange
    const exchangeType = "fanout";

    await channel.assertExchange(exchange, exchangeType, { durable: true });

    const buffer = Buffer.from(JSON.stringify(product));

    // Publish the message to the exchange

    // Routing key yahan par issliye use nai hoti hai kuki ye sabhi queue ko data bhej dega. Jabb sabhi queues ko ye data bhej dega fir routing key ka kya kaam. Issliye Fanout exchange mein routing key ka koi kaam nai hota hai.

    // Ye saare messages ka copy bna kar ke har ek queue mai send kar dega
    channel.publish(exchange, "", buffer, { persistent: true });

    console.log("Product announced successfully:", product.name);

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("Error while sending mail:", err);
  }
};

announceNewProduct({
  id: 123,
  name: "Samsung Galaxy S25 Ultra",
  price: "200000",
});
