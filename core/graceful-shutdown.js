/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `graceful-shutdown.js`   |   {√}                                           *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Attempts to close connections and flush logs when termination signals or   *|
|* unexpected server errors are encountered.                                  *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @package mongoose
 * @see https://www.npmjs.com/package/mongoose
 */
import mongoose from 'mongoose';

/**
 * @module markManualDisconnect
 */
import { markManualDisconnect } from './database-event-listeners.js';

/**
 * @module logMessage
 * Centralized logging utility with config-driven levels and formats.
 */
import logMessage from './filesystem/logger.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE HELPER VARIABLES                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @var {boolean} isDevelopment
 * Specifies whether the current environment is `development`.
 */
const isDevelopment = process.env.NODE_ENV === 'development';

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
export default async function attemptGracefulShutdown(signal, server, error = '') {
    /**
     * Public warning that the API server is closing.
     */
    logMessage.warn(
        `WARNING >> Received ${signal} signal... attempting graceful shutdown.`
    );

    if (signal === 'unhandledRejection' || signal === 'uncaughtException') {
        /**
         * Public message indicating an unexpected error was the issue.
         */
        logMessage.error('RUNTIME ERROR >> An unexpected server error occurred.');
    }
    
    /**
     * Private message with error details and stack when available.
     */
    const timestamp = new Date().toTimeString();

    isDevelopment && logMessage.error(
        `[${timestamp}] ${error?.stack ? error.stack : String(error)}`
    );


    /**
     * Set a timeout to force closure if processes or connections hang.
     */
    const shutdownTimeout = setTimeout(() => {
        /**
         * Public message indicating timeout.
         */
        logMessage.error("SHUTDOWN ERROR >> Shutdown timed out. Forcing exit.");

        /**
         * The process exits with a 3 code in the event of shutdown timeouts. 
         * If a timeout is encountered, it means the graceful shutdown process
         * got stuck somewhere.
         */
        process.exit(3);
    }, 10000);

    

    /* —————————————————————————————————————————————————————————————————————————— *\
    |  HANDLE SHUTDOWN                                                             |
    \* —————————————————————————————————————————————————————————————————————————— */
    try {
        /**
         * Mark disconnection as manual/intentional.
         */
        markManualDisconnect();


        /* —— ⦾ —— ⦾ —— ⦾ —— { ATTEMPT TO CLOSE DATABASE } —— ⦾ —— ⦾ —— ⦾ —— */
        await mongoose.disconnect();


        /* —— ⦾ —— ⦾ —— ⦾ —— { ATTEMPT TO CLOSE SERVER } —— ⦾ —— ⦾ —— ⦾ —— */
        await new Promise((resolve, reject) => {
            server.close(closeError => {
                /**
                 * Clear timeout
                 */
                clearTimeout(shutdownTimeout);

                /**
                 * Public message confirming successful resource cleanup.
                 */
                if (closeError) return reject(closeError);
                logMessage.info(
                    `🛈 INFO 🛈 >> HTTP server shut down gracefully.`
                );

                resolve();
            });
        });


        /**
         * The process exits with a 0 code when cleanup is successful. If the
         * application exits here it was able to complete all cleanup tasks.
         */
        process.exit(0);
    } catch (error) {
        /**
         * Public message indicating cleanup failure.
         */
        logMessage.error('CLEANUP ERROR >> Exiting server with failure code (2).');

        /**
         * Private message with error details and stack when available.
         */
        const timestamp = new Date().toTimeString();

        isDevelopment && logMessage.error(
            `[${timestamp}] ${error?.stack ? error.stack : String(error)}`
        );

        /**
         * The process exits with a 2 code in the event of cleanup errors. If a cleanup
         * error is encountered, it means the database or server could not be closed
         * correctly.
         */
        process.exit(2);
    }
}
