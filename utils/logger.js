const winston = require("winston");

const transports = [
    new winston.transports.File({ filename: './logs/app.log' })
];

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports
});

module.exports = logger;
