/**
 * Production-safe logging utility
 * Only logs in development mode to prevent sensitive information exposure
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },

  error: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.error(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },

  info: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },

  debug: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug(...args);
    }
  },

  // For critical errors that should always be logged (but sanitized)
  critical: (message: string, error?: unknown) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.error('🚨 CRITICAL:', message, error);
    } else {
      // In production, only log sanitized error messages
      // eslint-disable-next-line no-console
      console.error('🚨 CRITICAL:', message);
    }
  },

  // For API responses that should be logged in development but not production
  api: (message: string, data?: unknown) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`🌐 API: ${message}`, data);
    }
  },

  // For user actions that should be logged in development but not production
  user: (action: string, data?: unknown) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`👤 USER: ${action}`, data);
    }
  },

  // For blockchain transactions that should be logged in development but not production
  blockchain: (action: string, data?: unknown) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(`⛓️ BLOCKCHAIN: ${action}`, data);
    }
  },
};

export default logger;
