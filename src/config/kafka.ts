import type { Consumer, Producer } from "kafkajs";

import { Kafka, logLevel } from "kafkajs";

import logger from "./logger";
import env from "./validate-env";

/**
 * Kafka client instance configured for FleetOS Fleet Service
 */
const kafka = new Kafka({
  clientId: "fleet-os-fleet-service",
  brokers: [env.KAFKA_BROKER || "kafka.infrastructure.svc.cluster.local:9092"],
  logLevel: logLevel.WARN,
  retry: {
    initialRetryTime: 100,
    retries: 8,
    maxRetryTime: 30000,
    multiplier: 2,
  },
  connectionTimeout: 10000,
  requestTimeout: 30000,
});

/**
 * Kafka producer instance for publishing events
 */
const producer: Producer = kafka.producer({
  allowAutoTopicCreation: true,
  transactionTimeout: 30000,
  maxInFlightRequests: 5,
  idempotent: true,
  retry: {
    retries: 5,
  },
});

/**
 * Kafka consumer instance for consuming events
 */
const consumer: Consumer = kafka.consumer({
  groupId: "fleet-service-group",
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  retry: {
    retries: 5,
  },
});

let isProducerConnected = false;
let isConsumerConnected = false;

/**
 * Connect the Kafka producer
 */
export async function connectProducer(): Promise<void> {
  if (!isProducerConnected) {
    try {
      await producer.connect();
      isProducerConnected = true;
      logger.info("✅ Kafka producer connected successfully");
    }
    catch (error) {
      logger.error("❌ Failed to connect Kafka producer", error);
      throw error;
    }
  }
}

/**
 * Connect the Kafka consumer
 */
export async function connectConsumer(): Promise<void> {
  if (!isConsumerConnected) {
    try {
      await consumer.connect();
      isConsumerConnected = true;
      logger.info("✅ Kafka consumer connected successfully");
    }
    catch (error) {
      logger.error("❌ Failed to connect Kafka consumer", error);
      throw error;
    }
  }
}

/**
 * Disconnect the Kafka producer
 */
export async function disconnectProducer(): Promise<void> {
  if (isProducerConnected) {
    try {
      await producer.disconnect();
      isProducerConnected = false;
      logger.info("Kafka producer disconnected");
    }
    catch (error) {
      logger.error("Error disconnecting Kafka producer", error);
    }
  }
}

/**
 * Disconnect the Kafka consumer
 */
export async function disconnectConsumer(): Promise<void> {
  if (isConsumerConnected) {
    try {
      await consumer.disconnect();
      isConsumerConnected = false;
      logger.info("Kafka consumer disconnected");
    }
    catch (error) {
      logger.error("Error disconnecting Kafka consumer", error);
    }
  }
}

export { consumer, kafka, producer };
