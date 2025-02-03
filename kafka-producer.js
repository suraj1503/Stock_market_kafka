const { Kafka } = require('kafkajs');
const csv = require('csv-parser'); // To read CSV files
const fs = require('fs');


const kafka = new Kafka({
  clientId: 'my-producer-app',
  brokers: ['52.90.110.84:9092'], 
});

const producer = kafka.producer();


async function sendMessage(topic, message) {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log('Message sent:', message);
}

// Main function
async function run() {
  // Connect to Kafka
  await producer.connect();
  console.log('Producer connected to Kafka');


  await sendMessage('demo_test', { surname: `pal` });


  const results = [];
  fs.createReadStream('data/indexProcessed.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data)) 
    .on('end', async () => {
      console.log('CSV file successfully processed');


      setInterval(() => {
        const randomRow = results[Math.floor(Math.random() * results.length)];
        sendMessage('demo_test', randomRow);
      }, 1000);
    });
}


run().catch((err) => {
  console.error('Error in producer:', err);
});


process.on('SIGINT', async () => {
  console.log('Disconnecting producer...');
  await producer.disconnect();
  process.exit();
});