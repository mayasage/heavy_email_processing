import { promisify } from "util";
import redis from "../lib/redis.js";
import sqs from "../lib/sqs.js";

const POLL_WAIT_TIME = 1000;

const setTimeoutP = promisify(setTimeout);

let doPoll;

const poll = async () => {
  if (!doPoll) return;
  await setTimeoutP(POLL_WAIT_TIME);
  const notis = await redis.fn.getNotis();
  if (notis) {
    await sqs.sendMsgs(notis);
    console.log(`Sent ${notis.length} messages to SQS!`);
  }
  poll();
};

const changePoll = (val) => {
  if (val === doPoll) return;
  doPoll = val;
  if (doPoll === true) poll();
};

const pollRedisToSqs = {
  start: () => {
    if (doPoll === true) {
      console.log(`Already Polling`);
      return;
    }
    console.log(`Polling Started`);
    changePoll(true);
  },
  stop: () => {
    if (doPoll === false) {
      console.log(`Already Not Polling`);
      return;
    }
    console.log(`Polling Stopped`);
    changePoll(false);
  },
};

export default pollRedisToSqs;
