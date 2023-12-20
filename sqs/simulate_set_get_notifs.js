import redis from "./lib/redis.js";
import pollRedisToSqs from "./service/poll_redis_to_sqs.js";

import { promisify } from "util";

const setTimeoutP = promisify(setTimeout);

setInterval(() => redis.fn.setNoti("hello kitty"), 100);
pollRedisToSqs.start();
await setTimeoutP(1000);
pollRedisToSqs.stop();
