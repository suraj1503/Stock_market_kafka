require('dotenv').config(); 
const { Kafka } = require('kafkajs');
const AWS = require('aws-sdk');
const fs = require('fs');


const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY, 
  secretAccessKey: process.env.SECRET_ACCESS_KEY, 
  region: process.env.AWS_REGION, 
});


const kafka = new Kafka({
  clientId: 'my-consumer-app',
  brokers: ['52.90.110.84:9092'], 
});

const consumer = kafka.consumer({ groupId: 'test-group' });


async function uploadToS3(bucket, key, data) {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json',
  };

  try {
    await s3.upload(params).promise();
    console.log(`Uploaded to S3: s3://${bucket}/${key}`);
  } catch (err) {
    console.error('Error uploading to S3:', err);
  }
}


async function run() {
 
  await consumer.connect();
  console.log('Consumer connected to Kafka');

  
  await consumer.subscribe({ topic: 'demo_test', fromBeginning: true });
  console.log('Subscribed to topic: demo_test');

  let count = 0;

  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());

      
      const key = `stock_market_${count}.json`;
      await uploadToS3('kafka-stock-market-001', key, value);

      count++;
    },
  });
}


run().catch((err) => {
  console.error('Error in consumer:', err);
});

process.on('SIGINT', async () => {
  console.log('Disconnecting consumer...');
  await consumer.disconnect();
  process.exit();
});