const AWS = require("aws-sdk");

// Set the region
AWS.config.update({ region: "ap-south-1" });

// Create an SQS service object
const sqs = new AWS.SQS();

const sendToSqs = async ({ msg, url, sqs }) => {
  const params = {
    MessageBody: msg,
    QueueUrl: url,
  };

  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.error("Error sending message to SQS:", err);
        return reject(err);
      }
      console.log("Message sent successfully:", data.MessageId);
      resolve(true);
    });
  });
};

const receiveFromSqs = async ({ url, timeout = 10, count = 1 }) => {
  const params = {
    QueueUrl: url,
    MaxNumberOfMessages: count,
    VisibilityTimeout: timeout,
  };

  return new Promise((resolve, reject) => {
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.error("Error receiving messages from SQS:", err);
        return reject(err);
      }

      if (data.Messages) {
        const message = data.Messages[0];
        console.log("Received message:", message.Body);

        // Delete the received message

        return resolve(message);
      }

      console.log("No messages available");
      resolve(null);
    });
  });
};

const deleteMsgFromSqs = async ({ url, receiptHandle }) => {
  const params = {
    QueueUrl: url,
    ReceiptHandle: receiptHandle,
  };

  return new Promise((resolve, reject) => {
    sqs.deleteMessage(params, (err) => {
      if (err) {
        console.error("Error deleting message from SQS:", err);
        return reject(err);
      }
      console.log("Message deleted successfully");
      resolve(true);
    });
  });
};

sendToSqs({
  message: "Hello from Node.js!",
  url: "",
  sqs,
});
