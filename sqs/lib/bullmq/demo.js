import { Worker } from "bullmq";
import bullmqcfg from "./bullmqcfg.js";

const demo = new Worker("demo", async (job) => {
  console.log(job.data);
}, bullmqcfg);

export default demo;
