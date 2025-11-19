/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* logger.js | {√}/utilities                                                  *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Centralized logging utility with config-driven levels and formats, and     *|
|* support for multiple content types (e.g. text, json).                      *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author: Steven "Chris" Clements <clements.steven07@outlook.com>           *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';


/* —————————————————————————————————————————————————————————————————————————— *\
| Environment variables                                                        |
\* —————————————————————————————————————————————————————————————————————————— */
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
const logLevel = process.env.LOG_LEVEL || 'info';
const logDirectory = process.env.LOG_DIRECTORY || 'logs/';
const errorLogFile = process.env.ERROR_LOG_FILE || 'error-%DATE%.log'
const logFile = process.env.LOG_FILE || 'app-%DATE%.log'


/* —————————————————————————————————————————————————————————————————————————— *\
| Helper variables                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
const {
    combine, timestamp, printf, colorize, errors
} = winston.format;


/* —————————————————————————————————————————————————————————————————————————— *\
| Custom formatter                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Custom formatter that supports structured error contexts.
 * In development, pretty-prints JSON context; in production, keeps it compact.
 */
const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
    const output = stack ? stack : message;
    const context = Object.keys(meta).length
        ? JSON.stringify(meta, null, isDevelopment ? 2 : 0)
        : '';
    return `${timestamp} ${level}: ${output}${context ? ` | context: ${context}` : ''}`;
});



/* —————————————————————————————————————————————————————————————————————————— *\
| Ensure directory                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}


/* —————————————————————————————————————————————————————————————————————————— *\
| Logger configuration                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
const logger = winston.createLogger({
    level: logLevel,
    format: combine(
        colorize(),
        timestamp(),
        errors({ stack: isDevelopment }),
        logFormat
    ),
    transports: [
        new winston.transports.Console({ silent: isTest }),
        new winston.transports.DailyRotateFile({
            dirname: logDirectory,
            filename: errorLogFile,
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        }),
        new winston.transports.DailyRotateFile({
            dirname: logDirectory,
            filename: logFile,
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});


/* —————————————————————————————————————————————————————————————————————————— *\
| Log                                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module log
 * 
 * Logging utility for application messages with support for a variety of log
 * levels and formats.
 * 
 * @param {string} level
 * The log level of the event.
 * 
 * @param {string} message
 * The message to log.
 * 
 * @param {Object} context
 * Optional object with additional context.
 */
export default function log(level, message, context = {}) {
    if (message instanceof Error) {
        logger.log(level, {
            message: message.message,
            stack: message.stack,
            ...context
        });
    } else {
        logger.log(level, { message, ...context });
    }
}

