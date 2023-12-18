import AWS from "aws-sdk";

class AwsSqs {
  constructor({ url, accessKeyId, secretAccessKey, region }) {
    if (!url) throw new Error("url not defined");
    if (!region) throw new Error("region not defined");
    this.url = url;
    this.region = region;
    AWS.config.update({ accessKeyId, secretAccessKey, region });
    this.sqs = new AWS.SQS();
  }

  async sendMsg({ msg }) {
    const params = {
      MessageBody: msg,
      QueueUrl: this.url,
    };
    return new Promise((resolve, reject) => {
      this.sqs.sendMessage(params, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });
  }

  async receiveMsg({ timeout = 10, count = 1 }) {
    const params = {
      QueueUrl: this.url,
      MaxNumberOfMessages: count,
      VisibilityTimeout: timeout,
    };
    return new Promise((resolve, reject) => {
      this.sqs.receiveMessage(params, (err, data) => {
        if (err) return reject(err);
        if (data.Messages) return resolve(data.Messages);
        resolve(null);
      });
    });
  }

  async deleteMsg({ receiptHandle }) {
    const params = {
      QueueUrl: this.url,
      ReceiptHandle: receiptHandle,
    };
    return new Promise((resolve, reject) => {
      this.sqs.deleteMessage(params, (err) => {
        if (err) return reject(err);
        resolve(true);
      });
    });
  }
}

export default AwsSqs;
