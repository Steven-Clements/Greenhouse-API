/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* @file throttleHandler.js                                                   *|
|*                                                                            *|
|* Applies rate limiting to the routes in which limiters are applied to       *|
|* prevent brute force attacks and request abuse.                             *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @package express-rate-limit
 * @see https://www.npmjs.com/package/express-rate-limit
 */
import rateLimit from 'express-rate-limit';


/* —————————————————————————————————————————————————————————————————————————— *\
|  GLOBAL RATE LIMITER                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
export const globalRateLimiter = rateLimit({
    windowMs: 60000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            limit: options.limit,
            windowMs: options.windowMs
        })
    }
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  AUTH RATE LIMITER                                                           |
\* —————————————————————————————————————————————————————————————————————————— */
export const authRateLimiter = rateLimit({
    windowMs: 60000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            limit: options.limit,
            windowMs: options.windowMs
        })
    }
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  TOKEN RATE LIMITER                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
export const tokenRateLimiter = rateLimit({
    windowMs: 60000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            limit: options.limit,
            windowMs: options.windowMs
        })
    }
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  ERROR RATE LIMITER                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
export const errorRateLimiter = rateLimit({
    windowMs: 60000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            success: false,
            message: 'Too many requests. Please try again later.',
            limit: options.limit,
            windowMs: options.windowMs
        })
    }
});
