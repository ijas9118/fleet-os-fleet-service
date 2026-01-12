import type { EachMessagePayload } from "kafkajs";

import { consumer } from "@/config/kafka";
import logger from "@/config/logger";
import { DriverActivatedConsumer } from "@/infrastructure/kafka/consumers/driver-activated.consumer";

/**
 * Kafka Consumer Service
 * Manages Kafka consumer lifecycle and message routing
 */
export class KafkaConsumerService {
  private driverActivatedConsumer: DriverActivatedConsumer;
  private isRunning: boolean = false;

  constructor() {
    this.driverActivatedConsumer = new DriverActivatedConsumer();
  }

  /**
   * Start consuming messages from Kafka
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn("Kafka consumer already running");
      return;
    }

    try {
      // Subscribe to topics
      await consumer.subscribe({
        topics: ["auth-events"],
        fromBeginning: false,
      });

      logger.info("✅ Subscribed to topic: auth-events");

      // Start consuming messages
      await consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          await this.handleMessage(payload);
        },
      });

      this.isRunning = true;
      logger.info("🚀 Kafka consumer service started");
    }
    catch (error) {
      logger.error("❌ Failed to start Kafka consumer", error);
      throw error;
    }
  }

  /**
   * Route messages to appropriate handlers based on event type
   */
  private async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const eventType = message.headers?.["event-type"]?.toString();

    logger.debug("Received message", {
      topic,
      partition,
      offset: message.offset,
      eventType,
    });

    try {
      if (eventType === "auth.user.driver.activated") {
        await this.driverActivatedConsumer.handleMessage(payload);
      }
      else {
        logger.debug(`Unhandled event type: ${eventType}`);
      }
    }
    catch (error) {
      logger.error("Error processing message", {
        error,
        eventType,
        offset: message.offset,
      });
      // Don't throw - continue processing other messages
    }
  }

  /**
   * Check if consumer is running
   */
  isConsumerRunning(): boolean {
    return this.isRunning;
  }
}
