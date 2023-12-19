import {
  SQSClient,
  paginateListQueues,
  SendMessageBatchCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  DeleteMessageBatchCommand,
} from "@aws-sdk/client-sqs";

const config = {
  queueUrl: "",
  accessKeyId: "",
  secretAccessKey: "",
  region: "ap-south-1",
};

const client = new SQSClient({
  region: config.region,
  credentials: {
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  },
});

const listQueues = async () => {
  const paginatedQueues = paginateListQueues({ client }, {});
  const queues = [];
  for await (const page of paginatedQueues) {
    if (page.QueueUrls?.length) {
      queues.push(...page.QueueUrls);
    }
  }
  const suffix = queues.length === 1 ? "" : "s";
  console.log(
    `Hello, Amazon SQS! You have ${queues.length} queue${suffix} in your account.`
  );
  console.log(queues.map((t) => `  * ${t}`).join("\n"));
};

const sendMsgs = async (msgs) => {
  const cmd = new SendMessageBatchCommand({
    QueueUrl: config.queueUrl,
    Entries: msgs,
    // const arr = [];
    // for (let i = 0; i < 10; i += 1) {
    //   arr.push({
    //     Id: (i + 1) + '',
    //     MessageBody: notification_sample,
    //   });
    // }
  });
  try {
    return await client.send(cmd);
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$metadata;
    console.log({ requestId, cfId, extendedRequestId });
    return error;
    /**
     * The keys within exceptions are also parsed.
     * You can access them by specifying exception names:
     * if (error.name === 'SomeServiceException') {
     *     const value = error.specialKeyInException;
     * }
     */
  }
};

const recMsgs = async () => {
  const command = new ReceiveMessageCommand({
    AttributeNames: ["SentTimestamp"],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: ["All"],
    QueueUrl: config.queueUrl,
    // The duration (in seconds) for which the call waits for a message
    // to arrive in the queue before returning. If a message is available,
    // the call returns sooner than WaitTimeSeconds. If no messages are
    // available and the wait time expires, the call returns successfully
    // with an empty list of messages.
    // https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ReceiveMessage.html#API_ReceiveMessage_RequestSyntax
    WaitTimeSeconds: 20,
  });

  const response = await client.send(command);
  return response;
};

const delMsg = async (msg) => {
  await client.send(
    new DeleteMessageCommand({
      QueueUrl: config.queueUrl,
      ReceiptHandle: msg.ReceiptHandle,
    })
  );
};

const delMsgs = async (msgs) => {
  await client.send(
    new DeleteMessageBatchCommand({
      QueueUrl: config.queueUrl,
      Entries: msgs.map((msg) => ({
        Id: msg.MessageId,
        ReceiptHandle: msg.ReceiptHandle,
      })),
    })
  );
};

const recDel = async () => {
  const { Messages } = await recMsgs();
  if (!Messages) return;
  if (Messages.length === 1) {
    delMsg(Messages[0]).catch((err) =>
      console.error(
        `Couldn't delete a single message from SQS.
          messageId:${Messages[0].MessageId},
          receiptHandler: ${Messages[0].ReceiptHandle},
          err: ${err}`
      )
    );
  }
  else {
    delMsgs(Messages).catch((err) =>
      console.error(
        `Couldn't delete multiple messages from SQS.
          err: ${err}`
      )
    );
  }
  return Messages;
};

const sqs = {
  sendMsgs,
  listQueues,
  recMsgs,
  delMsg,
  delMsgs,
  recDel,
};

export default sqs;
