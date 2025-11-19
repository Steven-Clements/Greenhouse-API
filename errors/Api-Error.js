/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* Api-Error.js | {√}/errors                                                  *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* The base class for errors encountered by the Greenhouse API. This error is *|
|* extended by all of the other custom errors used by the Greenhouse API.     *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author: Steven "Chris" Clements <clements.steven07@outlook.com>           *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| API error                                                                    |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Create an instance of an ApiError. Extends the built-in error class for
 * standardized application errors.
 */
class ApiError extends Error {
    /**
     * Create a new ApiError instance.
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

        this.name = 'ApiError';
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
export default ApiError;
