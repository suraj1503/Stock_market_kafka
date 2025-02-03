# Stock Market Data Pipeline using Kafka, S3, and Athena

## Overview

This project sets up a **real-time stock market data pipeline** using **Kafka, AWS S3, a database, and AWS Athena** for analysis. It follows these steps:

1. **Kafka Producer**: Reads stock data from an Excel file and sends it to a Kafka broker.
2. **Kafka Consumer**: Reads the data from Kafka and stores it in an **S3 bucket**.
3. **Crawler & Database**: Fetches JSON data from S3 and stores it in a **database**.
4. **AWS Athena**: Runs queries on the stored stock market data for analysis.

## Technologies Used

- **Kafka** (Message Broker)
- **Node.js** (Producer & Consumer)
- **AWS S3** (Storage)
- **Database** (For structured data storage)
- **AWS Athena** (For querying JSON data)
- **EC2** (Hosting Kafka & Node.js services)

---

## Setup Instructions

### 1. **Setting up Kafka on EC2**

#### Install Kafka & Zookeeper

```sh
sudo apt update
sudo apt install openjdk-11-jdk -y
wget https://downloads.apache.org/kafka/3.3.1/kafka_2.13-3.3.1.tgz
tar -xvzf kafka_2.13-3.3.1.tgz
cd kafka_2.13-3.3.1
```

#### Configure Zookeeper & Start Kafka

```sh
bin/zookeeper-server-start.sh config/zookeeper.properties &
export KAFKA_HEAP_OPTS="-Xmx256M -Xms128M"
bin/kafka-server-start.sh config/server.properties &
```

#### Modify Kafka to Run on Public IP

To ensure Kafka is accessible on a public IP, modify the `server.properties` file:

1. Open the configuration file:
   ```sh
   sudo nano config/server.properties
   ```
2. Find the line with `ADVERTISED_LISTENERS` and change it to:
   ```
   ADVERTISED_LISTENERS=PLAINTEXT://<your-ec2-public-ip>:9092
   ```
3. Save and exit (Ctrl + X, then Y, then Enter).

#### Create a Kafka Topic

```sh
bin/kafka-topics.sh --create --topic stock-data --bootstrap-server <your-ec2-public-ip>:9092 --replication-factor 3 --partitions 3
```

---

### 2. **Set Up AWS S3 Crawler & Database**

1. **Create an S3 Bucket** in AWS.
2. Use **AWS Glue Crawler** to crawl JSON data in the S3 bucket and store it in a **database**.
3. Run queries on the stored data using **AWS Athena**.

---

### 3. **Producer and Consumer Code**

The producer and consumer have already been implemented and pushed to the repository. Please refer to the respective files in the project for their full implementation.

#### **Producer Dependencies**

Ensure the following dependencies are installed:

```sh
require('dotenv').config();
const { Kafka } = require('kafkajs');
const csv = require('csv-parser'); 
const fs = require('fs');
```

#### **Consumer Dependencies**

Ensure the following dependencies are installed:

```sh
require('dotenv').config();
const { Kafka } = require('kafkajs');
const AWS = require('aws-sdk');
const fs = require('fs');
```

---

### 4. **Analyze Data with AWS Athena**

Once data is stored in S3 and cataloged, use AWS Athena to query it:

```sql
SELECT * FROM stock_data_db;
```

---

## Running the Project

### **Start Kafka Services**

```sh
export KAFKA_HEAP_OPTS="-Xmx256M -Xms128M"
cd kafka_2.12-3.3.1
bin/kafka-server-start.sh config/server.properties
```

### **Run Producer**

```sh
node producer.js
```

### **Run Consumer**

```sh
node consumer.js
```

---

## Contributing

Feel free to raise an issue or submit a pull request if you have improvements or bug fixes.

