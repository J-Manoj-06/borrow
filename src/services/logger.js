/**
 * Centralized Production Logger Service.
 * Provides environment-aware logging with debug suppression in production
 * and structured error tracking for Crashlytics/Sentry integration.
 */

const isProduction = import.meta.env.PROD;

export const logger = {
  info: (message, ...args) => {
    if (!isProduction) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },

  warn: (message, ...args) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
  },

  error: (message, error, ...args) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error, ...args);
    // Placeholder for Sentry / Firebase Crashlytics error reporting
    if (isProduction && window.Sentry) {
      window.Sentry.captureException(error);
    }
  },

  activity: (action, details = {}) => {
    if (!isProduction) {
      console.log(`[AUDIT LOG] ${action}:`, details);
    }
  },
};

export default logger;
