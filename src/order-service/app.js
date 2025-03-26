"use strict";

const path = require("path");
const AutoLoad = require("@fastify/autoload");
const { Kafka } = require("kafkajs"); // Kafka client
const { MongoClient } = require("mongodb"); // MongoDB client

module.exports = async function (fastify, opts) {
  // Enable CORS
  fastify.register(require("@fastify/cors"), {
    origin: "*",
  });

  // MongoDB Connection
  const MONGODB_URI =
    process.env.MONGODB_URI || "mongodb://root:example@mongodb:27017"; // Use environment variable
  const mongoClient = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
    const db = mongoClient.db("your_database_name"); // Replace with your database name
    fastify.decorate("mongo", db); // Make MongoDB available globally in Fastify
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit if MongoDB connection fails
  }

  // Kafka Producer and Consumer Setup
  const KAFKA_BROKER = process.env.KAFKA_BROKER || "kafka:9092"; // Use environment variable
  const kafka = new Kafka({
    clientId: "fastify-app",
    brokers: [KAFKA_BROKER], // Use the Kafka broker from environment variable
  });

  const producer = kafka.producer();
  const consumer = kafka.consumer({ groupId: "fastify-consumer-group" });

  // Connect Kafka Producer
  try {
    await producer.connect();
    console.log("Kafka Producer connected");
    fastify.decorate("kafkaProducer", producer); // Make Kafka producer available globally
  } catch (err) {
    console.error("Failed to connect Kafka Producer", err);
    process.exit(1); // Exit if Kafka Producer connection fails
  }

  // Connect Kafka Consumer
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "your_topic_name", fromBeginning: true }); // Replace with your topic name
    console.log("Kafka Consumer connected and subscribed");
  } catch (err) {
    console.error("Failed to connect Kafka Consumer", err);
    process.exit(1); // Exit if Kafka Consumer connection fails
  }

  // Start consuming messages
  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        key: message.key?.toString(), // Use optional chaining to avoid errors
        value: message.value?.toString(), // Use optional chaining to avoid errors
      });
      // Add your message processing logic here
    },
  });

  // Graceful shutdown for Kafka and MongoDB
  fastify.addHook("onClose", async () => {
    try {
      await producer.disconnect();
      await consumer.disconnect();
      await mongoClient.close();
      console.log("Kafka and MongoDB connections closed");
    } catch (err) {
      console.error("Error during graceful shutdown", err);
    }
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
};
