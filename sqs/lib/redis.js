import Redis from "ioredis";
import redisConfig from "../config/redis.js";

const ins = new Redis(redisConfig);

const fn = {
  setNoti: async (msg) => {
    await ins.lpush("noti", msg);
  },
  getNotis: async (count = 10) => {
    return await ins.rpop("noti", count);
  },
};

const redis = {
  ins,
  fn,
};

export default redis;
