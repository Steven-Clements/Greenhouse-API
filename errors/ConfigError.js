/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `ConfigError.js`   |   {√}                                                 *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Throws errors when required configuration properties are missing or        *|
|* invalid.                                                                   *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  CONFIG ERROR                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Throws errors when configuration values are missing or invalid. Extends the
 * native Error object with HTTP status codes and optional details.
 */
export default class ConfigError extends Error {
    /**
     * @method Constructor
     * 
     * Create a new ConfigError instance.
     * 
     * @param {*} message
     * The error message describing the reason for the error.
     * 
     * @param {*} statusCode
     * The status code associated with the error.
     * 
     * @param {*} details
     * Optional object, array, or string value with error context.
     * 
     * @param {*} previous
     * Error details from the previously thrown error.
     */
    constructor(
        message = '',
        statusCode = 500,
        details = null,
        previous = null
    ) {
        /**
         * Ensure the status code is with a valid HTTP status range.
         */
        if (statusCode < 100 || statusCode > 599) {
            throw new RangeError(`Invalid HTTP status code: ${statusCode}. Must be within the range 100-599.`);
        }

        /**
         * Call parent constructor and set error properties.
         */
        super(message);
        this.name = 'ConfigError';
        this.statusCode = statusCode;
        this.details = details;
        this.previous = previous ?? null;

        /**
         * Capture and preserve stack trace.
         */
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
