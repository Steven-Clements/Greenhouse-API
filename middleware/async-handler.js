/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* async-handler.js | {√}/middleware                                          *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Wrapper for processing requests asynchronously by returning any errors     *|
|* that occur with a promise.                                                 *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Async Handler                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Wraps functions and requests for asynchronous processing.
 *
 * @param {Function} fn The asynchronous function to wrap.
 *
 * @returns {Function} A function with a (request, response, next) signature
 *      that handles any thrown errors.
 */
const asyncHandler = (fn) => (request, response, next) => {
  return Promise.resolve(fn(request, response, next)).catch(next);
};


/* —————————————————————————————————————————————————————————————————————————— *\
|  Export module                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
export default asyncHandler;
