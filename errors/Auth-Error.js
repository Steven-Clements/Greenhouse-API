/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* Auth-Error.js | {√}/errors                                                 *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Custom error thrown for authentication and authorization issues.           *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Auth error                                                                   |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Create an instance of an AuthError. Extends the built-in error class for
 * standardized application errors.
 */
class AuthError extends Error {
    /**
     * Create a new AuthError instance.
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

        this.name = 'AuthError';
        this.statusCode = statusCode || 401;
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
export default AuthError;
