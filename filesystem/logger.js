/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `logger.js`   |   {√}                                                      *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Centralized logging utility with config-driven levels and formats with     *|
|* support for both text and JSON output.                                     *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @package chalk
 * @see https://www.npmjs.com/package/chalk
 */
import chalk from 'chalk';


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE HELPER VARIABLES                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
const levels = { success: -1, error: 0, warn: 1, info: 2, debug: 3, trace: 4 }
const colorMap = {
    success: chalk.green.bold,
    error: chalk.red.bold,
    warn: chalk.yellow.bold,
    info: chalk.blue.bold,
    debug: chalk.cyan.bold,
    trace: chalk.gray
}
const currentLevelName = (process.env.LOG_LEVEL || 'info').toLowerCase();
const currentLevel = levels[currentLevelName] ?? levels.info;


/* —————————————————————————————————————————————————————————————————————————— *\
|  HELPER FUNCTIONS                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function resolveFormat
 * 
 * Determines which log format (e.g. text or json) to use to log the message.
 * 
 * @returns {string}
 * The format determined by configuration settings (overridden by the current
 * environment when not in development).
 */
const resolveFormat = (() => {
    const format = (process.env.LOG_FORMAT || '').toLowerCase();

    if (format) { return format; }

    return process.env.NODE_ENV === 'development' ? 'text' : 'json';
});

/**
 * @function formatText
 * 
 * Formats the messages logged while using the `text` format.
 * 
 * @param {number} level
 * The number identifying the current logging level.
 * 
 * @param {string} message
 * The incoming message to log.
 * 
 * @param {Object} meta
 * An optional object containing additional context.
 * 
 * @param {timestamp} timestamp
 * The current timestamp to append to the logged message. 
 */
function formatText(level, message, meta, timestamp) {
    const colorFunction = colorMap[level] || ((message) => message);
    let colorWrapper = colorFunction(`[${level.toUpperCase()}] ${message}`);

    if (meta && Object.keys(meta).length > 0) {
        base += ` ${JSON.stringify(meta)}`;
    }

    return `${timestamp} ${colorWrapper}`;
}

/**
 * @function formatJson
 * 
 * Formats the messages logged while using the `json` format.
 * 
 * @param {number} level
 * The number identifying the current logging level.
 * 
 * @param {string} message
 * The incoming message to log.
 * 
 * @param {Object} meta
 * An optional object containing additional context.
 * 
 * @param {timestamp} timestamp
 * The current timestamp to append to the logged message. 
 */
function formatJson(level, message, meta, timestamp) {
    return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta
    });
}


/**
 * @function log
 * 
 * Logs messages at the resolved level and format.
 * 
 * @param {number} level
 * The log level specified by configuration or 
 * 
 * @param {message} message
 * The styled message to log.
 * 
 * @param {meta} meta
 * Additional context to output, if any.
 */
function log(level, message, meta = {}) {
    if (levels[level] > currentLevel) {
        return;
    }

    const timestamp = new Date().toISOString();

    let output;

    switch (resolveFormat) {
        case 'json':
            output = formatJson(level, message, meta, timestamp);
            break;
        case 'text':
        default:
            output = formatText(level, message, meta, timestamp);
            break;
    }

    console.info(output);
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  LOG MESSAGE                                                                 |
\* —————————————————————————————————————————————————————————————————————————— */
const logMessage = {
    success: (message, meta) => log('success', message, meta),
    error: (message, meta) => log('error', message, meta),
    warn:  (message, meta) => log('warn', message, meta),
    info:  (message, meta) => log('info', message, meta),
    debug: (message, meta) => log('debug', message, meta),
    trace: (message, meta) => log('trace', message, meta)
}

export default logMessage;
