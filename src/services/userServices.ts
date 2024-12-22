import { createRedisClient } from "@/lib/redisClient";

export async function getUserData(userId: string) {
  const client = await createRedisClient();
  const data = await client.hgetall(`user:${userId}`);
  return data;
}

export type UserData = Awaited<ReturnType<typeof getUserData>>;
