import type { EachMessagePayload } from "kafkajs";

import logger from "@/config/logger";
import { DriverRepository } from "@/infrastructure/database/repositories/driver.repository";
import { CreateDriverPlaceholderUseCase } from "@/use-cases/driver/create-driver-placeholder.use-case";

/**
 * Kafka Consumer Handler for Driver Activated Events
 */
export class DriverActivatedConsumer {
  private _createDriverPlaceholderUseCase: CreateDriverPlaceholderUseCase;

  constructor() {
    const driverRepository = new DriverRepository();
    this._createDriverPlaceholderUseCase = new CreateDriverPlaceholderUseCase(driverRepository);
  }

  async handleMessage(payload: EachMessagePayload): Promise<void> {
    const { message } = payload;

    try {
      const event = JSON.parse(message.value?.toString() || "{}");

      logger.info("📥 Received driver activated event", {
        eventId: event.eventId,
        userId: event.payload?.userId,
      });

      // Validate event structure
      if (!event.payload || !event.payload.userId || !event.payload.tenantId) {
        logger.warn("Invalid event payload structure", { event });
        return;
      }

      // Create driver placeholder
      const driver = await this._createDriverPlaceholderUseCase.execute({
        userId: event.payload.userId,
        tenantId: event.payload.tenantId,
        email: event.payload.email,
        name: event.payload.name,
      });

      logger.info("✅ Driver placeholder created", {
        driverId: driver.id,
        userId: driver.userId,
        tenantId: driver.tenantId,
      });
    }
    catch (error) {
      logger.error("❌ Error processing driver activated event", {
        error,
        message: message.value?.toString(),
      });
      // Don't throw - let Kafka consumer continue processing other messages
    }
  }
}
