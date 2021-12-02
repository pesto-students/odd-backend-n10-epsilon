import amqplib from "amqplib";

const MESSAGES_BROKER_URL =
  "amqps://fnbiknmq:eOZfe-yGvc979gG3TH9oBTIfcoghniKI@puffin.rmq2.cloudamqp.com/fnbiknmq";

const EXCHANGE_NAME = "ODD_APP";
export const createChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGES_BROKER_URL);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);
    return channel;
  } catch (error) {
  }
};

export const publishMessage = async (channel, binding_key, message) => {
  try {
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log("message: sending");
  } catch (error) {}
};

export const subscribeMessage = async (channel, service, binding_key) => {
  try {
    const appQueue = await channel.assertQueue("Queue_name");
    channel.bindQueue(appQueue.queue, EXCHANGE_NAME, binding_key);
    channel.consume(appQueue.queue, (data) => {
      console.log(data.content.toString());
      channel.ack(data);
    });
  } catch (error) {}
};
