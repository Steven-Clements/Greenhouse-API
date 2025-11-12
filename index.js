/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `index.js`   |   {√}                                                       *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* The main entry point for the Greenhouse API server. The Greenhouse         *|
|* application that listens for API requests on the specified port.           *|
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
 * @see https://www.npmjs.com/package/express
 */
import dotenv from 'dotenv';

/**
 * @package helmet
 * @see https://www.npmjs.com/package/helmet
 */
import helmet from 'helmet';

/**
 * @package morgan
 * @see https://www.npmjs.com/package/morgan
 */
import morgan from 'morgan';

/**
 * @package chalk
 * @see https://www.npmjs.com/package/chalk
 */
import chalk from 'chalk';


/* —————————————————————————————————————————————————————————————————————————— *\
|  INITIALIZE MODULES                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
dotenv.config();


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE HELPER VARIABLES                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @var {string} nodeEnv
 * The environment in which the application is currently operating.
 */
const nodeEnv = process.env.NODE_ENV || 'development';

/**
 * @var {boolean} isDevelopment
 * Specifies whether the current environment is `development`.
 */

const isDevelopment = process.env.NODE_ENV === 'development';
/**
 * @var {number} port
 * Specifies the port which the application should listen on for requests.
 */

const port = Number(process.env.PORT) || 5000;
/**
 * @var {string} basePath
 * Specifies the base path for incoming API requests.
 */

const basePath = process.env.RENDER_EXTERNAL_URL || process.env.BASE_PATH || 'http://localhost';

/**
 * @var {string} versionPath
 * Specifies the current version path for incoming API requests.
 */
const versionPath = process.env.VERSION_PATH || '/api/v1';


/* —————————————————————————————————————————————————————————————————————————— *\
|  MAIN ENTRY POINT                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
(async () => {
    try {
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
        app.use(helmet);


        /* —— ⦾ —— ⦾ —— ⦾ —— { Dev dependencies } —— ⦾ —— ⦾ —— ⦾ —— */
        /**
         * Logs incoming request data, including the status code and elapsed time.
         */
        app.use(morgan('dev'));


        /* —————————————————————————————————————————————————————————————————————————— *\
        |  LISTEN FOR REQUESTS                                                         |
        \* —————————————————————————————————————————————————————————————————————————— */
        /**
         * @var {import('http').Server} app
         * The HTTP server instance running on running on node.js supporting the application.
         */
        const serverInstance = app.listen(port, () => {
            /**
             * Public status messages indicating successful server connections and
             * applicable request URI.
             */
            console.info(chalk.green.bold(
                `SUCCESS >> Greenhouse API server started successfully in ${nodeEnv} mode.`
            ));
            console.info(chalk.blue.bold(
                `INFO >> Listening for requests at ${basePath}:${port}...`
            ));
        });


        /* —————————————————————————————————————————————————————————————————————————— *\
        |  DEFINE API ROUTES                                                           |
        \* —————————————————————————————————————————————————————————————————————————— */
        /**
         * Dispatches requests to the appropriate router (`v1` or `static`) based on
         * the incoming URI and request data.
         */
        app.get(`/`, (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Call dispatchRequest() here.'
            });
        });


        /* —————————————————————————————————————————————————————————————————————————— *\
        |  EVENT LISTENERS                                                             |
        \* —————————————————————————————————————————————————————————————————————————— */
        /**
         * Listen for signals sent by the OS and trigger a graceful shutdown with the
         * relevant error, if known.
         */
        process.on('unhandledRejection', (reason) => {
            attemptGracefulShutdown('unhandledRejection', serverInstance, reason);
        });
        process.on('uncaughtException', (error) => {
            attemptGracefulShutdown('uncaughtException', serverInstance, error);
        });
        process.on('SIGINT', () => attemptGracefulShutdown('SIGINT', serverInstance));
        process.on('SIGTERM', () => attemptGracefulShutdown('SIGTERM', serverInstance));
    } catch (error) {
        /* —————————————————————————————————————————————————————————————————————————— *\
        |  BOOT ERRORS                                                                 |
        \* —————————————————————————————————————————————————————————————————————————— */
        /**
         * Public message indicating there was an issue booting the application.
         */
        console.error(chalk.red.bold('BOOT ERROR >> Exiting server with failure code (1).'));

         /**
         * Private message with error details and stack when available.
         */
        const timestamp = new Date().toTimeString();

        isDevelopment && console.error(chalk.red.bold(
            `[${timestamp}] ${error?.message ? (error.message) : ''} ${error?.stack ? error.stack : String(error)}`
        ));

        /**
         * The process exits with a 1 code in the event of boot errors. If a boot error
         * is encountered, it means there was in issue initializing the Express server
         * or another global application dependency the server relies on.
         */
        process.exit(1);
    }
})();


/* —————————————————————————————————————————————————————————————————————————— *\
|  ATTEMPT GRACEFUL SHUTDOWN                                                   |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function attemptGracefulShutdown
 * 
 * Attempts to close connections with the server, database, and other application
 * resources cleanly. Enforces a timeout to flush logs and allow process to
 * complete successfully.
 * 
 * @param {string} signal
 * The OS termination signal intercepted by the relevant event listener.
 * 
 * @param {import('http').Server} server
 * The HTTP server instance attempting graceful shutdown. 
 * 
 * @param {string|Error} error
 * The error or reason for the signal, if known.
 */
export async function attemptGracefulShutdown(signal, server, error = '') {
    /**
     * Public warning that the API server is closing.
     */
    console.warn(chalk.yellow.bold(
        `WARNING >> Received ${signal} signal... attempting graceful shutdown.`
    ));

    if (signal === 'unhandledRejection' || signal === 'uncaughtException') {
        /**
         * Public message indicating an unexpected error was the issue.
         */
        console.error(chalk.red.bold('RUNTIME ERROR >> An unexpected server error occurred.'));
    }
    
    /**
     * Private message with error details and stack when available.
     */
    const timestamp = new Date().toTimeString();

    isDevelopment && console.error(chalk.red.bold(
        `[${timestamp}] ${error?.message ? (error.message) : ''} ${error?.stack ? error.stack : String(error)}`
    ));
    

    /* —————————————————————————————————————————————————————————————————————————— *\
    |  HANDLE SHUTDOWN                                                             |
    \* —————————————————————————————————————————————————————————————————————————— */
    try {
        /* —— ⦾ —— ⦾ —— ⦾ —— { ATTEMPT TO CLOSE SERVER } —— ⦾ —— ⦾ —— ⦾ —— */
        await new Promise((resolve, reject) => {
            server.close(closeError => {
                /**
                 * Public message confirming successful resource cleanup.
                 */
                if (closeError) return reject(closeError);
                console.info(chalk.blue.bold(
                    `🛈 INFO 🛈 >> HTTP server shut down gracefully.`
                ));

                resolve();
            });
        });

        /**
         * The process exits with a 0 code when cleanup is successful. If the
         * application exits here it was able to complete all cleanup tasks.
         */
        process.exit(0);
    } catch (shutdownError) {
        /**
         * Public message indicating cleanup failure.
         */
        console.error(chalk.red.bold('BOOT ERROR >> Exiting server with failure code (1).'));

        /**
         * Private message with error details and stack when available.
         */
        const timestamp = new Date().toTimeString();

        isDevelopment && console.error(chalk.red.bold(
            `[${timestamp}] ${error?.message ? (error.message) : ''} ${error?.stack ? error.stack : String(error)}`
        ));

        /**
         * The process exits with a 2 code in the event of cleanup errors. If a cleanup
         * error is encountered, it means the database or server could not be closed
         * correctly.
         */
        process.exit(2);
    }
}
