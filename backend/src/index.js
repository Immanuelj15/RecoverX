const app = require('./app');
const { env, validateEnv } = require('./config/env');
const { connectDB } = require('./config/db');
const logger = require('./utils/logger');

validateEnv();

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(env.PORT, () => {
      logger.info(`RecoverX Backend running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });

    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        const { disconnectDB } = require('./config/db');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
