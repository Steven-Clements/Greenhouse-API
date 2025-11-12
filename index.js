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
 * @module loadRuntimeDependencies
 * Loads runtime dependencies required for the application to function as
 * expected.
 */
import loadRuntimeDependencies from './core/runtime-dependencies.js';

/**
 * @module logMessage
 * Centralized logging utility with config-driven levels and formats.
 */
import logMessage from './filesystem/logger.js';

/**
 * @module registerOsSignalListeners
 * Listens for terminations signals and events caused by unexpected errors.
 */
import registerOsSignalListeners from './core/os-signal-listeners.js';


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


/* —————————————————————————————————————————————————————————————————————————— *\
|  MAIN ENTRY POINT                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
(async () => {
    try {
        /* —— ⦾ —— ⦾ —— ⦾ —— { Bootstrap dependencies } —— ⦾ —— ⦾ —— ⦾ —— */
        const app = loadRuntimeDependencies();

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
            logMessage.success(
                `SUCCESS >> Greenhouse API server started successfully in ${nodeEnv} mode.`
            );
            logMessage.info(
                `INFO >> Listening for requests at ${basePath}:${port}...`
            );
        });


        /* —————————————————————————————————————————————————————————————————————————— *\
        |  OS SIGNAL LISTENERS                                                         |
        \* —————————————————————————————————————————————————————————————————————————— */
        registerOsSignalListeners();


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
    } catch (error) {
        /* —————————————————————————————————————————————————————————————————————————— *\
        |  BOOT ERRORS                                                                 |
        \* —————————————————————————————————————————————————————————————————————————— */
        /**
         * Public message indicating there was an issue booting the application.
         */
        logMessage.error('BOOT ERROR >> Exiting server with failure code (1).');

         /**
         * Private message with error details and stack when available.
         */
        const timestamp = new Date().toTimeString();

        isDevelopment && logMessage.error(
            `[${timestamp}] ${error?.stack ? error.stack : String(error)}`
        );

        /**
         * The process exits with a 1 code in the event of boot errors. If a boot error
         * is encountered, it means there was in issue initializing the Express server
         * or another global application dependency the server relies on.
         */
        process.exit(1);
    }
})();


