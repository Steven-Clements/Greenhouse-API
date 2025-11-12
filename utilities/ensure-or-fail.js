/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `ensureOrFail.js`   |   {√}                                                *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Determines whether the specified parameter is a valid and present value    *|
|* or throws an error if the value is missing or invalid.                     *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import ConfigError from "../errors/Config-Error.js"


/* —————————————————————————————————————————————————————————————————————————— *\
|  ENSURE OR FAIL                                                              |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function ensureOrFail
 * 
 * Checks if the specified property exists and contains a valid value.
 * 
 * @param {any} parameterValue
 * The current value of the named property.
 * 
 * @param {string} parameterName
 * The name of the property that required validation.
 * 
 * @returns {boolean}
 * True if the property is present and valid.
 * 
 * @throws {ConfigError}
 * If the property is missing or invalid.
 */
export default function ensureOrFail(parameterValue, parameterName) {
    if (
        parameterValue === null ||
        parameterValue === undefined ||
        parameterValue === '' ||
        parameterValue === 0
    ) {
        throw new ConfigError(
            `The required configuration property '${parameterName}' is missing or invalid.`,
            500,
            `${parameterName} not present in 'process.env'`
        );
    }

    return true;
}
