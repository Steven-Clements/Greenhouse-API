/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* static-routes.js | {√}/routes                                              *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Primary router for API requests. Dispatches requests for both static and   *|
|* API routes based on the specified URI.                                     *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import express from 'express';


/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import createUser from '../controllers/users/create-user.js';
import validateRequest from '../middleware/validation-handler.js';
import createUserRules from '../middleware/rules/create-user-rules.js';
import upload from '../middleware/upload-handler.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Initialize router                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
const router = express.Router();


/* —————————————————————————————————————————————————————————————————————————— *\
| Define API endpoints                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
router.route('/')
    .post(upload.single('profilePicture'), createUserRules, validateRequest, createUser);


/* —————————————————————————————————————————————————————————————————————————— *\
| Export router                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export default router;
