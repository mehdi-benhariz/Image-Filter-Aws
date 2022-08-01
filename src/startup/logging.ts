const { createLogger, transports, format } = require("winston");
const createTransFile = (Options: any) => new transports.File(Options);
const createTransConsole = (Options = {}) => new transports.Console(Options);
const logConfiguration = {
  transports: [
    createTransFile({
      filename: "./logs/info.log",
      level: "info",
    }),
    createTransConsole({
      filename: "./logs/warning.log",
      level: "warning",
    }),

    createTransFile({
      filename: "./logs/error.log",
      level: "error",
    }),
    createTransConsole(),
  ],
  format: format.combine(
    format.label({
      label: {
        info: `🏷️`,
        warning: `🚨`,
        error: `🚨`,
      },
    }),
    format.timestamp({
      format: "MMM-DD-YYYY HH:mm:ss",
    }),
    format.printf(
      (info: any) =>
        `${info.level}: ${info.label[info.level]}: ${[info.timestamp]}: ${
          info.message
        }`
    ),
    format.align()
  ),
};
const logger = createLogger(logConfiguration);
module.exports = logger;
