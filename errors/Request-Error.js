/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `RequestError.js`   |   {√}                                                *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Throws errors when an error (other than a validation or not found error)   *|
|* occurs during an API request.                                              *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  REQUEST ERROR                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Throws errors when an unexpected issue occurs during a request. Extends the
 * native Error object with HTTP status codes and optional details.
 */
export default class RequestError extends Error {
    /**
     * @method Constructor
     * 
     * Create a new RequestError instance.
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
        statusCode = 400,
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
        this.name = 'RequestError';
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
