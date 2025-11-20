/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* validation-handler.js | {√}/middleware                                     *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Validates requests based on the rules established in `middleware/rules`    *|
|* and the URI specified in the message.                                      *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Import dependencies                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import { validationResult } from "express-validator";


/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import InvalidParameterError from '../errors/Invalid-Parameter-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Validate requests against rules                                              |
\* —————————————————————————————————————————————————————————————————————————— */
export default function validateRequest(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new InvalidParameterError(
            `One or more parameters are invalid. Check errors below for details.`,
            400,
            true,
            errors
        );
    }

    next();
}
