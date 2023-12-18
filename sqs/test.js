import AwsSqs from "./sqs.js";

const sqs = new AwsSqs({
  url: "https://sqs.ap-south-1.amazonaws.com/019018150142/MyQueue",
  accessKeyId: "",
  secretAccessKey: "",
  region: "ap-south-1",
});

// const bool = await sqs.sendMsg({ msg: "Ranger, I'm glad to see you." });
// console.log("send:", bool);
const msg = await sqs.receiveMsg({ count: 10, timeout: 10 });
console.log(msg);
