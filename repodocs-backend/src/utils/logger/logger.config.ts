import { config } from "dotenv";
import * as winston from "winston";
import * as DailyRotateFile from "winston-daily-rotate-file";
import * as path from "path";

// Load environment variables
config();

// Custom log levels
export const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5,
};

// Log level colors
export const logColors = {
  fatal: "red",
  error: "red",
  warn: "yellow",
  info: "green",
  debug: "blue",
  trace: "magenta",
};

// Add colors to Winston
winston.addColors(logColors);

// Define important and unimportant log levels
export const importantLogLevels = ["fatal", "error", "warn"];
export const unimportantLogLevels = ["info", "debug", "trace"];

// Get current environment
const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

// Determine which log levels to show based on environment
const getLogLevels = () => {
  if (isDevelopment) {
    return Object.keys(logLevels); // Show all levels in development
  } else if (isProduction) {
    return importantLogLevels; // Show only important levels in production
  }
  return importantLogLevels; // Default to important levels
};

// Create logs directory path
const logsDir = path.join(process.cwd(), "logs");

// Console transport configuration
const consoleTransport = new winston.transports.Console({
  level: isDevelopment ? "trace" : "warn",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      ({ timestamp, level, message, context, trace, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]`;

        if (context) {
          log += ` [${context}]`;
        }

        log += `: ${message}`;

        if (Object.keys(meta).length > 0) {
          log += ` ${JSON.stringify(meta, null, 2)}`;
        }

        if (trace) {
          log += `\n${trace}`;
        }

        return log;
      }
    )
  ),
});

// File transport for important logs (fatal, error, warn)
const importantFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "important-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "warn", // Only important levels
  maxSize: "20m",
  maxFiles: "14d", // Keep logs for 14 days
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
});

// File transport for all logs (development only)
const allFileTransport = new DailyRotateFile({
  filename: path.join(logsDir, "all-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  level: "trace", // All levels
  maxSize: "20m",
  maxFiles: "7d", // Keep logs for 7 days
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
});

// Create Winston logger instance
export const createLogger = (context?: string) => {
  const transports: winston.transport[] = [consoleTransport];

  // Add file transports based on environment
  if (isDevelopment) {
    transports.push(allFileTransport);
  }

  // Always add important file transport
  transports.push(importantFileTransport);

  const logger = winston.createLogger({
    levels: logLevels,
    level: getLogLevels()[getLogLevels().length - 1], // Set to highest available level
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.metadata({ fillExcept: ["message", "level", "timestamp"] })
    ),
    transports,
    // Handle uncaught exceptions and unhandled rejections
    exceptionHandlers: [
      new DailyRotateFile({
        filename: path.join(logsDir, "exceptions-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: "30d",
      }),
    ],
    rejectionHandlers: [
      new DailyRotateFile({
        filename: path.join(logsDir, "rejections-%DATE%.log"),
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: "30d",
      }),
    ],
  });

  return logger;
};
