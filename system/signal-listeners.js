/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* signal-listeners.js | {√}/system                                           *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Listens for OS termination signals and triggers a graceful shutdown when   *|
|* a signal is detected.                                                      *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author: Steven "Chris" Clements <clements.steven07@outlook.com>           *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import attemptGracefulShutdown from './graceful-shutdown.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Register signal listeners                                                    |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module registerSignalListeners
 * 
 * Detects OS termination signals and triggers a graceful shutdown when a
 * signal is detected.
 * 
 * @param {import('http').Server} server
 * The HTTP server instance to close. 
 */
export default async function registerSignalListeners(server) {
    process.on('uncaughtException', async (error) => {
        log ('error', `UNCAUGHT EXCEPTION`, {
            name: error.name, message: error.message, stack: error.stack
        });

        await attemptGracefulShutdown('uncaughtException', server);
    });
    process.on('unhandledRejection', async (reason) => {
        if (reason instanceof Error) {
            log ('error', `UNHANDLED REJECTION`, {
                name: reason.name, message: reason.message, stack: reason.stack
            });
        } else {
            log ('error', `UNHANDLED REJECTION`, {
                message: reason
            });
        }

        await attemptGracefulShutdown('unhandledRejection', server)
    });
    process.on('SIGINT', async () => await attemptGracefulShutdown('signalInterrupt', server));
    process.on('SIGTERM', async () => await attemptGracefulShutdown('signalTerminate', server));
}
