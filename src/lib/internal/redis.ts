import { createClient } from "redis";

let redis: any = null;
let redisPublisher: any = null;

async function getRedisClient() {
  if (!redis) {
    redis = await createClient({
      url: process.env.REDIS_URL,
    })
      .on("error", (err) => console.log("Redis Client Error", err))
      .connect();
  }
  return redis;
}

async function getRedisPublisher() {
  if (!redisPublisher) {
    redisPublisher = await createClient({
      url: process.env.REDIS_URL,
    })
      .on("error", (err) => console.log("Publisher Redis Client Error", err))
      .connect();
  }
  return redisPublisher;
}

export { getRedisClient as redis, getRedisPublisher as redisPublisher };
