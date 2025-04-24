import amqp from "amqplib";

const sendToDelayedQueue = async (batchId, orders, delay) => {
	try {
		// Connect to RabbitMQ
		const connection = await amqp.connect("amqp://localhost");
		const channel = await connection.createChannel();

		// Setup Exchange
		const exchange = "delayed_exchange";
		await channel.assertExchange(exchange, "x-delayed-message", {
			arguments: {
				"x-delayed-type": "direct",
			},
		});

		const queue = "delayed_order_updates_queue";

		await channel.assertQueue(queue, {
			durable: true,
		});

		await channel.bindQueue(queue, exchange, "");

		const message = JSON.stringify({ batchId, orders });
		channel.publish(exchange, "", Buffer.from(message), {
			headers: {
				"x-delay": delay, // Set the delay for the message
			},
		});

		console.log("---------------------------- \n");
		console.log(
			`Sent batch ${batchId} update task to delayed queue with ${delay} ms delay `,
		);
		console.log("---------------------------- \n");

		await channel.close();
		await connection.close();
	} catch (err) {
		console.error("Error while sending mail:", err);
	}
};

const processBatchOrders = () => {
	// Simulate batch processing
	const batchId = generateBatchId();
	const orders = collectOrdersForBatch();

	console.log("---------------------------- \n");
	console.log(
		`Processing batch ${batchId} with orders ${JSON.stringify(orders)})}`,
	);
	console.log("---------------------------- \n");

	// Update inventory, generate shipping labels, etc.
	processOrders(orders);

	// Send delayed message to update order status
	const delay = 10000; // 10 sec
	sendToDelayedQueue(batchId, orders, delay);
};

const generateBatchId = () => {
	return `batch- ${Date.now()}`;
};

const collectOrdersForBatch = () => {
	// Collect orders for the current batch

	return [
		{
			orderId: 1,
			item: "Laptop",
			quantity: 1,
		},
		{
			orderId: 2,
			item: "Phone",
			quantity: 2,
		},
	];
};

const processOrders = (orders) => {
	// Process orders
	// Update inventory, generate shipping labels, etc.
	// For demonstration purposes, just log the orders
	console.log("Processing orders:", JSON.stringify(orders));
};

processBatchOrders();
