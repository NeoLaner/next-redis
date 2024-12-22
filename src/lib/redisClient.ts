import Redis from "ioredis";

export async function createRedisClient() {
  const client = new Redis();

  client.on("error", (err) => {
    console.log(`${err} happened 1`);
  });

  return client;
}
