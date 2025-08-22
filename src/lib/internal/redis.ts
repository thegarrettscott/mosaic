import { createClient } from "redis";

let redisClient: any = null;
let redisPublisherClient: any = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });
    redisClient.on("error", (err: any) => console.log("Redis Client Error", err));
    await redisClient.connect();
  }
  return redisClient;
}

async function getRedisPublisher() {
  if (!redisPublisherClient) {
    redisPublisherClient = createClient({
      url: process.env.REDIS_URL,
    });
    redisPublisherClient.on("error", (err: any) => console.log("Publisher Redis Client Error", err));
    await redisPublisherClient.connect();
  }
  return redisPublisherClient;
}

// Create a proxy that forwards all Redis operations to the actual client
export const redis = new Proxy({}, {
  get(target, prop) {
    return async function(...args: any[]) {
      const client = await getRedisClient();
      return client[prop](...args);
    };
  }
});

export const redisPublisher = new Proxy({}, {
  get(target, prop) {
    return async function(...args: any[]) {
      const client = await getRedisPublisher();
      return client[prop](...args);
    };
  }
});
