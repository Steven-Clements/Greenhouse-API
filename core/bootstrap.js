/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `bootstrap.js`   |   {√}                                                   *|
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

/**
 * @package express-handlebars
 * @see https://www.npmjs.com/package/express-handlebars
 */
import { engine } from 'express-handlebars'

/**
 * @package path
 */
import path from 'path';

/**
 * @module validateConfig
 * Validates configuration from `process.env` to determine if required
 * properties are present.
 */
import validateConfig from './validate-config.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  INITIALIZE MODULES                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
dotenv.config();


/* —————————————————————————————————————————————————————————————————————————— *\
|  LOAD RUNTIME DEPENDENCIES                                                   |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function boot
 * 
 * Loads runtime dependencies to enable proper application functionality.
 * 
 * @return {import('express').Application} app
 * The pre-configured application to start up.
 */
export default function boot() {
    /* —————————————————————————————————————————————————————————————————————————— *\
    |  VALIDATE CONFIGURATION                                                      |
    \* —————————————————————————————————————————————————————————————————————————— */
    validateConfig();


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

    /**
     * Handlebars templating engine for express authentication.
     */
    app.engine('hbs', engine({
        extname: '.hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(process.cwd(), 'views', 'layouts')
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(process.cwd(), 'views'));

    /**
     * Define a path for static assets.
     */
    app.use('/assets', express.static(path.join(process.cwd(), 'public')));

    return app;
}
