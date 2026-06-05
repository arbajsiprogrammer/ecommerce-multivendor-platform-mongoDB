import winston, { format, transports } from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    // winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:MM:SS" }),
    winston.format.printf(
      (info) =>
        `[${info.timestamp}] : ${info.level.toUpperCase()} : ${info.message}`,
    ),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./logs/ecommerce.logs.txt" }),
  ],
});

export default logger;
