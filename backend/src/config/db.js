const mongoose = require('mongoose');
const { env } = require('./env');
const logger = require('../utils/logger');

let isConnected = false;

const connectDB = async (customUri) => {
  const mongoUri = customUri || (process.env.NODE_ENV === 'test' ? env.MONGODB_URI_TEST : env.MONGODB_URI);

  if (isConnected && mongoose.connection.readyState === 1) {
    logger.info('Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    isConnected = true;
    logger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB connection lost');
      isConnected = false;
    });

    return conn.connection;
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB Disconnected successfully');
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  getConnectionStatus: () => mongoose.connection.readyState
};
