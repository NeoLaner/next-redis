// lib/rabbitmq.js
import amqp from "amqplib";

let connection: amqp.Connection;
let channel: amqp.Channel;

export async function getRabbitMQChannel() {
  if (!connection) {
    connection = await amqp.connect("amqp://localhost");
    channel = await connection.createChannel();
  }
  return channel;
}
