import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

app.listen(env.port, () => {
  logger.info(`Backend running at http://localhost:${env.port}`);
});
