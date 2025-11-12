/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `graceful-shutdown.js`   |   {√}                                           *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Attempts to close connections and flush logs when termination signals or   *|
|* unexpected server errors are encountered.                                  *|
\* ------------------------->>All rights reserved.<<------------------------- */

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
        logMessage.error('BOOT ERROR >> Exiting server with failure code (1).');

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
