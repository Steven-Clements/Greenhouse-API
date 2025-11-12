/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* v1Routes.js                                                               *|
|*                                                                            *|
|* Handles requests to uris beginning with `/api/v1`.                         *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @package express
 * @see https://www.npmjs.com/package/express
 */
import express from 'express';

/**
 * @module userRoutes
 * @see /routes/userRoutes.js
 */
import userRoutes from './userRoutes.js';
/**
 * @module emailRoutes
 * @see /routes/emailRoutes.js
 */
import emailRoutes from './emailRoutes.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  INITIALIZE DEPENDENCIES                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
const router = express.Router();


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE API ROUTES (/api/v1/{:uri})                                          |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 *   User Routes
 * <<————————————————————————————————————————————————————————————————>>
 *   Handles requests to uris beginning with `/api/v1/users`.
 */
router.use('/users', userRoutes);
router.use('/email', emailRoutes);

export default router;
