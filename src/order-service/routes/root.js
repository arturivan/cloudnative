"use strict";

module.exports = async function (fastify, opts) {
  // POST endpoint to send a message to Kafka and store it in MongoDB
  fastify.post("/", async function (request, reply) {
    const msg = request.body;

    try {
      // Send the message to Kafka
      await fastify.kafkaProducer.send({
        topic: "your_topic_name", // Replace with your Kafka topic name
        messages: [{ value: JSON.stringify(msg) }],
      });

      // Store the message in MongoDB
      const collection = fastify.mongo.collection("messages"); // Replace with your collection name
      await collection.insertOne({ message: msg, timestamp: new Date() });

      reply.code(201).send({ status: "Message sent and stored successfully" });
    } catch (err) {
      reply
        .code(500)
        .send({ error: "Failed to process the message", details: err.message });
    }
  });

  // Health check endpoint
  fastify.get("/health", async function (request, reply) {
    const appVersion = process.env.APP_VERSION || "0.1.0";
    return { status: "ok", version: appVersion };
  });

  // Example endpoint to demonstrate MongoDB usage
  fastify.get("/hugs", async function (request, reply) {
    try {
      const collection = fastify.mongo.collection("messages"); // Replace with your collection name
      const messages = await collection.find({}).toArray();
      return { hugs: messages };
    } catch (err) {
      reply
        .code(500)
        .send({ error: "Failed to fetch messages", details: err.message });
    }
  });
};
