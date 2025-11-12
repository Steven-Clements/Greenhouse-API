/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `runtime-dependencies.js`   |   {√}                                        *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Loads runtime dependencies required for the application to function as     *|
|* expected.                                                                  *|
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
 * @package dotenv
 * @see https://www.npmjs.com/package/dotenv
 */
import dotenv from 'dotenv';

/**
 * @package helmet
 * @see https://www.npmjs.com/package/helmet
 */
import helmet from 'helmet';


/* —————————————————————————————————————————————————————————————————————————— *\
|  INITIALIZE MODULES                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
dotenv.config();


/* —————————————————————————————————————————————————————————————————————————— *\
|  LOAD RUNTIME DEPENDENCIES                                                   |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function loadRuntimeDependencies
 * 
 * Loads runtime dependencies to enable proper application functionality.
 * 
 * @return {import('express').Application} app
 * The pre-configured application to start up.
 */
export default function loadRuntimeDependencies() {
    /* —————————————————————————————————————————————————————————————————————————— *\
    |  BOOTSTRAP APPLICATION                                                       |
    \* —————————————————————————————————————————————————————————————————————————— */
    /**
     * @var {express.Application} app
     * The express server instance running the Greenhouse API.
     */
    const app = express();


    /**
     * This setting tells Express that the API server is sitting behind a proxy
     * and that the `X-Forwarded-*` header fields can be trusted, enabling:
     *   - Allows `X-Forwarded-Proto` header field  to be set by reverse proxy to
     *     inform the client of HTTPS requirements (or a lack thereof).
     *   - Populates the `req.ip` and `req.ips` values with values from the
     *     `X-Forwarded-For` list of addresses.
     */
    app.set('trust proxy', 1);


    /* —— ⦾ —— ⦾ —— ⦾ —— { Runtime dependencies } —— ⦾ —— ⦾ —— ⦾ —— */
    /**
     * Accepts and parses incoming request data when `application/json` is set as
     * the content type.
     */
    app.use(express.json());

    /**
     * Accepts and parses incoming request data when the content type is set to
     * `application/x-www-form-urlencoded`.
     */
    app.use(express.urlencoded({
        extended: true
    }));

    /**
     * Helps secure Express applications by setting secure HTTP response headers.
     */
    app.use(helmet());

    return app;
}
