/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* Config-Error.js | {√}/errors                                               *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Custom error thrown when required configuration properties (derived from   *|
|* environment variables) are missing or invalid.                             *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Config error                                                                 |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Create an instance of a ConfigError. Extends the built-in error class for
 * standardized application errors.
 */
class ConfigError extends Error {
    /**
     * Create a new ConfigError instance.
     * 
     * @param {string} message
     * The error message.
     * 
     * @param {number} statusCode
     * The HTTP status code (e.g. 400, 404, 500).
     * 
     * @param {boolean} isOperational
     * Specifies whether the error is expected (client/user input versus bug).
     * 
     * @param {Error|any} cause
     * The original error object or value that cause this error.
     */
    constructor(message, statusCode, isOperational, cause) {
        super (message, { cause });

        this.name = 'ConfigError';
        this.statusCode = statusCode || 500;
        this.isOperational = isOperational || false;
        this.cause = cause || undefined;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


/* —————————————————————————————————————————————————————————————————————————— *\
| Export modules                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
export default ConfigError;
