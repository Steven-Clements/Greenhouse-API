/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* Not-Found-Error.js | {√}/errors                                            *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Custom error thrown when a client requests a route that does not exist.    *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Not found error                                                              |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Create an instance of a NotFoundError. Extends the built-in error class for
 * standardized application errors.
 */
class NotFoundError extends Error {
    /**
     * Create a new NotFoundError instance.
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

        this.name = 'NotFoundError';
        this.statusCode = statusCode || 404;
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
export default NotFoundError;
