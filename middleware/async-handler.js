/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* @file asyncHandler.js                                                      *|
|*                                                                            *|
|* Creates a Promise wrapper around requests to handle asynchronous functions *|
|* without repetitive try-catch blocks.                                       *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  ASYNC HANDLER                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Wraps functions and requests for asynchronous processing.
 * 
 * @param {Function} fn The asynchronous function to wrap.
 * 
 * @returns {Function} A function with a (request, response, next) signature
 *      that handles any thrown errors. 
 */
const asyncHandler = fn => (request, response, next) => {
    return Promise.resolve(fn(request, response, next)).catch(next);
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  EXPORT MODULE                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
export default asyncHandler;
