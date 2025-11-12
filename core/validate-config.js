/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `validate-config.js`   |   {√}                                             *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Validates configuration from `process.env` to determine if required        *|
|* properties are present.                                                    *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import ensureOrFail from '../utilities/ensureOrFail.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  VALIDATE CONFIG                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function validateConfig
 * 
 * Ensures that application-critical environment variables are loaded into
 * process.env.
 */
export default function validateConfig() {
    /* —— ⦾ —— ⦾ —— ⦾ —— { General requirements } —— ⦾ —— ⦾ —— ⦾ —— */
    ensureOrFail(process.env.NODE_ENV, 'NODE_ENV');
    ensureOrFail(process.env.PORT, 'PORT');
    ensureOrFail(process.env.VERSION_PATH, 'VERSION_PATH');
    ensureOrFail(process.env.MONGO_URI, 'MONGO_URI');
    ensureOrFail(process.env.LOG_LEVEL, 'LOG_LEVEL');
    ensureOrFail(process.env.LOG_FORMAT, 'LOG_FORMAT');


    /* —— ⦾ —— ⦾ —— ⦾ —— { Development requirements } —— ⦾ —— ⦾ —— ⦾ —— */
    if (process.env.NODE_ENV === 'development') {
        ensureOrFail(process.env.BASE_PATH, 'BASE_PATH');
    }

    /* —— ⦾ —— ⦾ —— ⦾ —— { Production requirements } —— ⦾ —— ⦾ —— ⦾ —— */
    if (process.env.NODE_ENV === 'production') {
        ensureOrFail(process.env.RENDER_EXTERNAL_URL, 'RENDER_EXTERNAL_URL');
    }
}
