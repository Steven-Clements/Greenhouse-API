/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `os-signal-listeners.js`   |   {√}                                         *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Listens for terminations signals and events caused by unexpected errors    *|
|* and forwards the processing to the graceful shutdown function.             *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module attemptGracefulShutdown
 * Centralized logging utility with config-driven levels and formats.
 */
import attemptGracefulShutdown from './graceful-shutdown.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  OS SIGNAL LISTENERS                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function registerOsSignalListeners
 * 
 * Listen for signals sent by the OS and trigger a graceful shutdown with the
 * relevant error, if known.
 * 
 * @param {import('http').Server} serverInstance
 */
export default function registerOsSignalListeners(serverInstance) {
    process.on('unhandledRejection', (reason) => {
    attemptGracefulShutdown('unhandledRejection', serverInstance, reason);
    });
    process.on('uncaughtException', (error) => {
        attemptGracefulShutdown('uncaughtException', serverInstance, error);
    });
    process.on('SIGINT', () => attemptGracefulShutdown('SIGINT', serverInstance));
    process.on('SIGTERM', () => attemptGracefulShutdown('SIGTERM', serverInstance));
    process.once('SIGUSR2', () => {
        attemptGracefulShutdown('SIGUSR2', serverInstance).then(() => {
            process.kill(process.pid, 'SIGUSR2');
        });
    });
}
