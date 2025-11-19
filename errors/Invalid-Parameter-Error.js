/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* Invalid-Parameter-Error.js | {√}/errors                                    *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Custom error thrown when validation fails for a given route.               *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author: Steven "Chris" Clements <clements.steven07@outlook.com>           *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Invalid parameter error                                                      |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Create an instance of a InvalidParameterError. Extends the built-in error
 * class for standardized application errors.
 */
class InvalidParameterError extends Error {
    /**
     * Create a new InvalidParameterError instance.
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

        this.name = 'InvalidParameterError';
        this.statusCode = statusCode || 400;
        this.isOperational = isOperational || true;
        this.cause = cause || undefined;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


/* —————————————————————————————————————————————————————————————————————————— *\
| Export modules                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
export default InvalidParameterError;
