import { Queue, Worker } from "bullmq";
import redisConfig from "../../config/redis.js";
import { readdir } from "fs/promises";
import { join, dirname, resolve as presolve } from "path";

const cfg = { connection: redisConfig };

const ufolder = dirname(import.meta.url);
const pfolder = presolve(".", "lib", "bullmq");

export const mq = {};
export const mqw = {};

const build = async () => {
  const files = await readdir(pfolder);

  for (let i = 0; i < files.length; i += 1) {
    const file = files[i];

    if (file === "index.js") continue;
    if (!file.endsWith(".js")) continue;

    const filePath = join(ufolder, file);
    const imp = await import(filePath);

    const fn = imp.default;
    const name = fn.name;
    console.log(fn, name);

    mq[name] = new Queue(name, cfg);
    mqw[name] = new Worker(name, fn, cfg);
  }
};

await build();
