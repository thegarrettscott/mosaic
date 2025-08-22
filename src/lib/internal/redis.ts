import { createClient } from "redis";

let redisClient: any = null;
let redisPublisherClient: any = null;
let connectionError: Error | null = null;

async function getRedisClient() {
  if (connectionError) {
    throw connectionError;
  }
  
  if (!redisClient) {
    try {
      if (!process.env.REDIS_URL) {
        throw new Error("REDIS_URL environment variable is not set");
      }
      
      redisClient = createClient({
        url: process.env.REDIS_URL,
      });
      redisClient.on("error", (err: any) => console.log("Redis Client Error", err));
      await redisClient.connect();
    } catch (error) {
      connectionError = error as Error;
      console.error("Failed to initialize Redis:", error);
      throw error;
    }
  }
  return redisClient;
}

async function getRedisPublisher() {
  if (connectionError) {
    throw connectionError;
  }
  
  if (!redisPublisherClient) {
    try {
      if (!process.env.REDIS_URL) {
        throw new Error("REDIS_URL environment variable is not set");
      }
      
      redisPublisherClient = createClient({
        url: process.env.REDIS_URL,
      });
      redisPublisherClient.on("error", (err: any) => console.log("Publisher Redis Client Error", err));
      await redisPublisherClient.connect();
    } catch (error) {
      connectionError = error as Error;
      console.error("Failed to initialize Redis Publisher:", error);
      throw error;
    }
  }
  return redisPublisherClient;
}

// Create a proxy that forwards all Redis operations to the actual client
export const redis = new Proxy({}, {
  get(target, prop) {
    return async function(...args: any[]) {
      try {
        const client = await getRedisClient();
        return client[prop](...args);
      } catch (error) {
        console.error("Redis operation failed:", error);
        throw error;
      }
    };
  }
});

export const redisPublisher = new Proxy({}, {
  get(target, prop) {
    return async function(...args: any[]) {
      try {
        const client = await getRedisPublisher();
        return client[prop](...args);
      } catch (error) {
        console.error("Redis Publisher operation failed:", error);
        throw error;
      }
    };
  }
});
