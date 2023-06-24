import { InjectRedis, Redis } from "@nestjs-modules/ioredis";
import { Injectable } from "@nestjs/common";
import { RedisKey } from "ioredis";

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private redis: Redis) {}

  async push(key: RedisKey, ...elements: (string | number | Buffer)[]) {
    await this.redis.lpush(key, ...elements);
  }

  async getList(key: RedisKey) {
    return await this.redis.lrange(key, 0, -1);
  }
}
