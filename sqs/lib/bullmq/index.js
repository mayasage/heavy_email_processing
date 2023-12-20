import { Queue } from "bullmq";
import bullmqcfg from "./bullmqcfg.js";
import demo from "./demo.js";

export const mq = {
  demo: new Queue("demo", bullmqcfg),
};

export const mqw = {
  demo,
};
