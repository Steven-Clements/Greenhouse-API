/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* saveOrFail.js                                                              *|
|*                                                                            *|
|* Attempts to save a given resource asynchronously and throws an error if    *|
|* there is a failure.                                                        *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT APPLICATION FILES                                                    |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module RequestError
 * Throws errors when an unexpected issue occurs during a request.
 */
import RequestError from "../errors/Request-Error.js";


/* —————————————————————————————————————————————————————————————————————————— *\
|  SAVE OR FAIL                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function saveOrFail
 * 
 * Attempts to save a resource asynchronously. If the save is successful the   |
|  function returns true to the controller, otherwise it throws a RequestError.
 * 
 * @param {mongoose.Object} resource
 * The mongoose resource object the application should attempt to save.
 * 
 * @returns {boolean} true
 * Returns true if the save operation is successful.
 * 
 * @throws {RequestError}
 * 
 */
const saveOrFail = async (resource) => {
    try {
        await resource.save();

        return true;
    } catch (error) {
        throw new RequestError(
            'An error occurred while attempting to save the resource.',
            500,
            error.stack || error.message
        );
    }
};


/* —————————————————————————————————————————————————————————————————————————— *\
|  EXPORT MODEL                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export default saveOrFail;
