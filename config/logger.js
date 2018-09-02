const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");

const logDir = "log";

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: "YYYY-MM-DD"
});

const logger = createLogger({
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [new transports.Console(), dailyRotateFileTransport]
});

module.exports = logger;
