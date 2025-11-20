/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* connect-mongo-db.js | {√}/system                                           *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Establishes a persistent connection with the MongoDB database that manages *|
|* data persistence and retrieval for the application. Automatically retries  *|
|* when connections fail to adjust for latency and automatically attempts to  *|
|* reestablish connections when that are lost unexpectedly.                   *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Import dependencies                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import mongoose from 'mongoose';


/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import DatabaseError from '../errors/Database-Error.js';
import registerMongoDbListeners from './mongo-db-listeners.js';
import log from '../utilities/logger.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Helper functions                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function enforceRetryDelay
 *
 * Determines whether a required property is present and valid before use.
 *
 * @param {any} property
 * The property that must be present to prevent runtime errors.
 */
const enforceRetryDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


/* —————————————————————————————————————————————————————————————————————————— *\
| Connect MongoDB                                                              |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Establish a persistent connection with a MongoDB database using the
 * Mongoose driver.
 *
 * @param {Object} options
 * Specify connection options for the MongoDB database:
 *  - `dbName`: The collection used to store application data.
 *  - `dbServerTimeoutMs`: The amount of time, in milliseconds, that the 
 *     database should wait for connections to resolve before timing out.
 *  - `dbHeartbeatMs`: The amount of time, in milliseconds, in between health
 *     checks for the database.
 *  - `dbMaxRetries`: The maximum number of times the application will allow
 *     the database to retry the connection.
 *  - `dbBaseDelayMs`: The amount of time, in milliseconds, that is minimally
 *     applied as the delay between connection attempts.
 *  - `dbJitterMs`: The maximum of amount of time that could variably be
 *     added to the retry delay based on exponential backoff calculations.
 * - `dbSocketTimeoutMs`: The maximum amount of time a query is allowed to
 *     process before failing.
 */
export default async function connectMongoDb(options = {
    mongoUri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME || 'app-dev',
    dbMaxRetries: Number.parseInt(process.env.DB_MAX_RETRIES, 10) || 4,
    dbHeartbeatMs: Number.parseInt(process.env.DB_HEARTBEAT_MS, 10) || 10000,
    dbServerTimeoutMs: Number.parseInt(process.env.DB_SERVER_TIMEOUT_MS, 10) || 5000,
    dbBaseDelayMs: Number.parseInt(process.env.DB_BASE_DELAY_MS, 10) || 1000,
    dbJitterMs: Number.parseInt(process.env.DB_JITTER_MS, 10) || 300,
    dbSocketTimeoutMs: Number.parseInt(process.env.DB_SOCKET_TIMEOUT_MS, 10) || 45000
}) {
    /* —————————————————————————————————————————————————————————————————————————— *\
    | Connection retry loop                                                        |
    \* —————————————————————————————————————————————————————————————————————————— */
    for (let attempt = 1; attempt <= options.dbMaxRetries; attempt++) {
        try {
            /* —————————————————————————————————————————————————————————————————————————— *\
            | Attempt to establish connection                                              |
            \* —————————————————————————————————————————————————————————————————————————— */
            const dbInfo = await mongoose.connect(options.mongoUri, {
                dbName: options.dbName,
                heartbeatFrequencyMS: options.dbHeartbeatMs,
                serverSelectionTimeoutMS: options.dbServerTimeoutMs,
                socketTimeoutMS: options.dbSocketTimeoutMs
            });

            log('info', `Connection to MongoDB database "${options.dbName}" on host ${dbInfo.connection.host} successful...`);

            registerMongoDbListeners(dbInfo.connection);

            return dbInfo;
        } catch (error) {
            /* —————————————————————————————————————————————————————————————————————————— *\
            | Calculate retry delay                                                        |
            \* —————————————————————————————————————————————————————————————————————————— */
            const exponentialDelay = options.dbBaseDelayMs * 2 ** (attempt - 1);
            const jitter = Math.floor((Math.random() * 2 - 1) * options.dbJitterMs);
            const delayMs = Math.max(0, exponentialDelay + jitter);

            log('warn', `Database connection attempt ${attempt} failed. Retrying in ${Math.round(delayMs / 1000)} seconds...`, { cause: error });

            /* —————————————————————————————————————————————————————————————————————————— *\
            | Retry connection until attempts exhausted                                    |
            \* —————————————————————————————————————————————————————————————————————————— */
            if (attempt < options.dbMaxRetries) {
                await enforceRetryDelay(delayMs);

                continue;
            } else {
                log('error', `All ${options.dbMaxRetries} connection attempts exhausted.`, { cause: error });
            }


            /* —————————————————————————————————————————————————————————————————————————— *\
            | Throw custom error                                                           |
            \* —————————————————————————————————————————————————————————————————————————— */
            throw new DatabaseError(
                `A connection to the MongoDB database, "${options.dbName}", could not be established.`,
                500,
                false,
                error
            );
        }
    }
}
