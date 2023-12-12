import winston from "winston";

export const devLogger = winston.createLogger({
  transports: [new winston.transports.Console({ level: "debug" })],
});

export const prodLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({ level: "info" }),
    new winston.transports.File({ filename: "./errors.log", level: "error" }),
  ],
});
