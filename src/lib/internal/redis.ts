import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;
let redisPublisherClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    })
      .on("error", (err) => console.log("Redis Client Error", err));
    await redisClient.connect();
  }
  return redisClient;
}

async function getRedisPublisher() {
  if (!redisPublisherClient) {
    redisPublisherClient = createClient({
      url: process.env.REDIS_URL,
    })
      .on("error", (err) => console.log("Publisher Redis Client Error", err));
    await redisPublisherClient.connect();
  }
  return redisPublisherClient;
}

export const redis = {
  get: async (key: string) => {
    const client = await getRedisClient();
    return client.get(key);
  },
  set: async (key: string, value: string, options?: any) => {
    const client = await getRedisClient();
    return client.set(key, value, options);
  },
  del: async (key: string) => {
    const client = await getRedisClient();
    return client.del(key);
  },
  subscribe: async (channel: string, callback: (message: string) => void) => {
    const client = await getRedisClient();
    return client.subscribe(channel, callback);
  },
  publish: async (channel: string, message: string) => {
    const client = await getRedisClient();
    return client.publish(channel, message);
  },
};

export const redisPublisher = {
  get: async (key: string) => {
    const client = await getRedisPublisher();
    return client.get(key);
  },
  set: async (key: string, value: string, options?: any) => {
    const client = await getRedisPublisher();
    return client.set(key, value, options);
  },
  del: async (key: string) => {
    const client = await getRedisPublisher();
    return client.del(key);
  },
  publish: async (channel: string, message: string) => {
    const client = await getRedisPublisher();
    return client.publish(channel, message);
  },
};
