import type { AxiosInstance } from "axios";

import axios from "axios";

import logger from "@/config/logger";
import env from "@/config/validate-env";

export class AuthServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.AUTH_SERVICE_URL,
      headers: {
        "x-internal-api-key": env.AUTH_SERVICE_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
  }

  /**
   * Mark a user as onboarded in the Auth Service
   * @param userId The ID of the user to mark as onboarded
   */
  async markUserOnboarded(userId: string): Promise<void> {
    try {
      await this.client.patch(`/api/v1/internal/users/${userId}/mark-onboarded`);
      logger.info(`Successfully marked user ${userId} as onboarded in Auth Service`);
    }
    catch (error: any) {
      logger.error(`Failed to mark user ${userId} as onboarded in Auth Service`, {
        error: error.message,
        response: error.response?.data,
      });
      // We diligently log the error but do not rethrow it to prevent blocking the onboarding flow
      // In a production system, this should likely enqueue a retry job
    }
  }
}
