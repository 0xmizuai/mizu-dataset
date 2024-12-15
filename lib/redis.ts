import { redisUrl } from "@/config/routes";
import { createClient, RedisClientType } from "redis";

let cacheClient: RedisClientType | undefined;

export async function getRedisClient(): Promise<RedisClientType> {
  if (!cacheClient) {
    cacheClient = createClient({
      url: redisUrl,
    });

    cacheClient.on("error", (err: any) =>
      console.log("Redis Client Error", err)
    );
  }

  if (!cacheClient.isReady) {
    await cacheClient.connect().catch((err: any) => {
      console.log("Redis Connect Error", err);
    });
  }

  return cacheClient;
}
