import "reflect-metadata";

import createApp from "./app";
import logger from "./config/logger";
import env from "./config/validate-env";

const app = createApp();

const PORT = env.PORT || 3004;

(async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Fleet Server started on port ${PORT}`);
    });
  }
  catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
})();
