/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `database-event-listeners.js`   |   {√}                                    *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Listens for database connection events and attempts to reconnect to the    *|
|* MongoDB database when a connection is lost unexpectedly.                   *|
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
 * @module connect
 * Attempts to connect to the application's MongoDB database with automated
 * retries and exponential backoff.
 */
import connect from './connect-mongo-db';

/**
 * @module logMessage
 * Logs messages at the resolved level and format.
 */
import logMessage from '../filesystem/logger';


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE HELPER VARIABLES                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @var {boolean} isDevelopment
 * Specifies whether the current environment is `development`.
 */
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * @var {boolean} isReconnecting
 * 
 * Specifies whether the database is attempting to reconnect.
 */
let isReconnecting = false;

/**
 * Specifies whether the database disconnection was purposefully triggered.
 */
let isManualDisconnect = false;


/* —————————————————————————————————————————————————————————————————————————— *\
|  REGISTER DATABASE EVENT LISTENERS                                           |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function registerDatabaseEventListeners
 * 
 * Listens for connections events and responds to unexpected disconnections
 * by attempting to reconnect to the database.
 * 
 * @param {mongoose.Connection} connection
 * The connection triggering the disconnection event.
 * 
 * @param {Object} options
 * Specify connection options for the MongoDB database:
 *  - `dbName`: The collection used to store application data.
 *  - `timeoutMs`: The amount of time, in milliseconds, that the database
 *     should wait for connections to resolve before timing out.
 *  - `heartbeatMs`: The amount of time, in milliseconds, in between health
 *     checks for the database.
 *  - `maxAttempts`: The maximum number of times the application will allow
 *     the database to retry the connection.
 *  - `baseDelayMs`: The amount of time, in milliseconds, that is minimally
 *     applied as the delay between connection attempts.
 *  - `jitterMs`: The maximum of amount of time that could variably be
 *     added to the retry delay based on exponential backoff calculations.
 */
export default function registerDatabaseEventListeners(connection, options) {
    connection.on("disconnected", async () => {
        if (!isManualDisconnect) {
            
            if (!isManualDisconnect && !isReconnecting) {
                /**
                 * Set reconnection flag.
                 */
                isReconnecting = true;

                /**
                 * Public warning advising the database experienced an
                 * unexpected disconnection.
                 */
                logMessage.warn("[WARNING] >> MongoDB disconnected unexpectedly. Attempting to reconnect...");

                /**
                 * Attempt to reconnect to database.
                 */
                try {
                    await connect(options);
                }
                
                /**
                 * 
                 */
                catch (error) {
                    /**
                     * Public message and error describing the connection failure.
                     */
                    logMessage.error("ERROR >> Automatic reconnection attempt failed.");

                    /**
                     * Private message with error details and stack when available.
                     */
                    const timestamp = new Date().toISOString();
                    if (isDevelopment) {
                        logMessage.error(`[${timestamp}] ${error?.stack ?? String(error)}`);
                    }
                } finally {
                    /**
                     * Reset reconnection flag.
                     */
                    isReconnecting = false;
                }
            }
        }
    });

    /**
     * Listens for the `reconnected` connection event.
     */
    connection.on("reconnected", () => {
        logMessage.success("✔ SUCCESS ✔ >> MongoDB reconnected.");

        isManualDisconnect = false;
    });

    /**
     * Listens for the `error` connection event.
     */
    connection.on("error", error => {
        /**
         * Public message and error describing the connection failure.
         */
        logMessage.error('ERROR >> MongoDB connection error.');

        /**
         * Private message with error details and stack when available.
         */
        const timestamp = new Date().toISOString();
        isDevelopment && logMessage.error(
            `[${timestamp}] ${error?.stack ? error.stack : String(error)}`
        );
    });
}

export function markManualDisconnect() {
    isManualDisconnect = true;
}
