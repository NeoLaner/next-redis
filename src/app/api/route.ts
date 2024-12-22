import { NextRequest } from "next/server";
import { createRedisClient } from "../../lib/redisClient";
import { getRabbitMQChannel } from "@/lib/rabbitmq";
import { string, z } from "zod";
import { getUserData, UserData } from "@/services/userServices";
export const dynamic = "force-dynamic";

async function createUser(userId, name, email, age) {
  const client = await createRedisClient();
  try {
    await client.hset(
      `user:${userId}`,
      "name",
      name,
      "email",
      email,
      "age",
      age
    );
    console.log(`User ${userId} created.`);
  } catch (error) {
    console.error("Error creating user:", error);
  }
}

const paramsSchema = z.object({
  id: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const params = paramsSchema.parse(new URL(request.url).searchParams);
    const data = await getUserData(params.id);
    if (data) return Response.json(data);
    return Response.json({ error: "User not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
  }
}

// Define a Zod schema for the request body
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const { name, email } = formSchema.parse(await req.json());

    const channel = await getRabbitMQChannel();
    const queue = "formQueue";
    await channel.assertQueue(queue, { durable: true });

    const message = JSON.stringify({ name, email });
    channel.sendToQueue(queue, Buffer.from(message));

    console.log(`Sent message to RabbitMQ: ${message}`);

    return Response.json({
      message: "Form data sent to RabbitMQ successfully!",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle validation errors
      return Response.json({ errors: error.errors }, { status: 400 });
    }
    console.error("Error sending message to RabbitMQ:", error);
    return Response.json({ message: "Internal Server Error" });
  }
}
