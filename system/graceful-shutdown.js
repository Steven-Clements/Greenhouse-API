/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* graceful-shutdown.js | {√}/system                                          *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Sets a server timeout to flush logs and close connections with external    *|
|* resources, such as MongoDB, Redis, and the Express server itself, before   *|
|* terminating the current process.                                           *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Import dependencies                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import log from '../utilities/logger.js'


/* —————————————————————————————————————————————————————————————————————————— *\
| Helper variables                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
const shutdownTimeoutMs = Number.parseInt(process.env.SHUTDOWN_TIMEOUT_MS, 10) || 5000;


/* —————————————————————————————————————————————————————————————————————————— *\
| Attempt graceful shutdown                                                    |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module attemptGracefulShutdown
 * 
 * Attempts to close connections with external resources, flush logs, and
 * enforces a server timeout when signals or errors cause the server to shut
 * down unexpectedly.
 * 
 * @param {string} signal
 * The OS signal triggering the graceful shutdown.
 * 
 * @param {import('http').Server} server
 * The HTTP server running on the current node.js process.
 */
export default async function attemptGracefulShutdown(signal, server, dbConnection) {
    log('warn', `Detected ${signal} signal. Attempting graceful shutdown...`);

    try {
        const shutdownTimeout = setTimeout(() => {
            log('error', 'Shutdown timed out, forcing exit');
            process.exit(1);
        }, shutdownTimeoutMs);

        await dbConnection.close();
        log('info', 'Closed MongoDB connection successfully.');

        server.close((error) => {               
            if (error) {
                log('error', 'Error closing HTTP server.', { cause: error });
                /* —————————————————————————————————————————————————————————————————————————— *\
                | Exit code 2 | Shutdown error                                                 |
                \* —————————————————————————————————————————————————————————————————————————— */
                process.exit(2);
            } else {
                log('info', 'Closed HTTP server process.');
                clearTimeout(shutdownTimeout);

                log('info', `Graceful shutdown completed after ${signal} signal.`);
                /* —————————————————————————————————————————————————————————————————————————— *\
                | Exit code 0 | Clean exit                                                     |
                \* —————————————————————————————————————————————————————————————————————————— */
                process.exit(0);
            }
        });

    } catch (shutdownError) {
        log('error', `Failed to complete cleanup`, {
            name: shutdownError.name, message: shutdownError.message, stack: shutdownError.stack
        });

        /* —————————————————————————————————————————————————————————————————————————— *\
        | Exit code 2 | Shutdown error                                                 |
        \* —————————————————————————————————————————————————————————————————————————— */
        process.exit(2);
    }
}
