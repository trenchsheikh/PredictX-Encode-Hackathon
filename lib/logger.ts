/**
 * Production-safe logging utility
 * Only logs in development mode to prevent sensitive information exposure
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
  
  // For critical errors that should always be logged (but sanitized)
  critical: (message: string, error?: any) => {
    if (isDevelopment) {
      console.error('🚨 CRITICAL:', message, error);
    } else {
      // In production, only log sanitized error messages
      console.error('🚨 CRITICAL:', message);
    }
  },
  
  // For API responses that should be logged in development but not production
  api: (message: string, data?: any) => {
    if (isDevelopment) {
      console.log(`🌐 API: ${message}`, data);
    }
  },
  
  // For user actions that should be logged in development but not production
  user: (action: string, data?: any) => {
    if (isDevelopment) {
      console.log(`👤 USER: ${action}`, data);
    }
  },
  
  // For blockchain transactions that should be logged in development but not production
  blockchain: (action: string, data?: any) => {
    if (isDevelopment) {
      console.log(`⛓️ BLOCKCHAIN: ${action}`, data);
    }
  }
};

export default logger;
