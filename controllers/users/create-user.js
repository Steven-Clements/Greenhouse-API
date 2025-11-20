/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* register.js | {√}/controllers/users                                        *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Create a new user through registration.                                    *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  Runtime Dependencies                                                        |
\* —————————————————————————————————————————————————————————————————————————— */
import asyncHandler from '../../middleware/async-handler.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  Create User                                                                 |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @route           POST    /api/v1/users
 * @description     Create a new user.
 * @access          Public
 */
const createUser = asyncHandler(async (req, res) => {
  
});

export default createUser;
