/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `developer-dependencies.js`   |   {√}                                      *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Loads developer dependencies required for application development when the *|
|* environment is set to `development`.                                       *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @package morgan
 * @see https://www.npmjs.com/package/morgan
 */
import morgan from 'morgan';


/* —————————————————————————————————————————————————————————————————————————— *\
|  LOAD DEV DEPENDENCIES                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function loadDeveloperDependencies
 * 
 * Loads developer dependencies conditionally based on the current environment.
 * 
 * @param {import{express}.Application} app
 * The partially loaded application to append developer dependencies to.
 * 
 * @param {import{express}.Application} app
 * The same application instance, now preloaded with developer dependencies.
 */
export default function loadDeveloperDependencies(app) {
    if (process.env.NODE_ENV === 'development') {
        /**
         * Logs incoming request data, including the status code and elapsed time.
         */
        app.use(morgan('dev'));
    }

    return app;
}
