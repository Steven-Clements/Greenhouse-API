/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `connect-mongo-db.js`   |   {√}                                            *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Attempts to connect to the application's MongoDB database with automated   *|
|* retries, exponential backoff, and connection recovery.                     *|
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
 * @module registerDatabaseEventListeners
 * Listens for database connection attempts and responds appropriately.
 */
import registerDatabaseEventListeners from './database-event-listeners.js';

/**
 * @module DatabaseError
 * Throws errors when the database encounters connectivity issues.
 */
import DatabaseError from '../errors/Database-Error.js';

/**
 * @module logMessage
 * Logs messages at the resolved level and format.
 */
import logMessage from '../filesystem/logger.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE HELPER VARIABLES                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @var {boolean} isDevelopment
 * Specifies whether the current environment is `development`.
 */
const isDevelopment = process.env.NODE_ENV === 'development';


/* —————————————————————————————————————————————————————————————————————————— *\
|  HELPER FUNCTIONS                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Determines whether a required property is present and valid before use.
 * 
 * @param {any} property
 * The property that must be present to prevent runtime errors.
 */
const enforceRetryDelay = ms => new Promise(resolve => setTimeout(resolve, ms));


/* —————————————————————————————————————————————————————————————————————————— *\
|  CONNECT MONGO DB                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Establish a persistent connection with a MongoDB database using the
 * Mongoose driver.
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
export default async function connect(options = {
    dbName: process.env.DB_NAME,
    timeoutMs: 5000,
    heartbeatMs: 10000,
    maxAttempts: 5,
    baseDelayMs: 1000,
    jitterMs: 300
}) {
    /**
     * Loop through the connection function until maximum connection
     * attempts are exhausted.
     */
    for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
        try {
            /**
             * Attempt to connect to the application's MongoDB database.
             */
            const active = await mongoose.connect(process.env.MONGO_URI, {
                dbName: options.dbName,
                serverSelectionTimeoutMS: options.timeoutMs,
                heartbeatFrequencyMS: options.heartbeatMs
            });

            /**
             * Public message reporting successful database connections.
             */
            logMessage.success(
                `✔ SUCCESS ✔ >> Connection established with MongoDB database '${options.dbName}' on host ${active.connection.host}...`
            );

            /**
             * Attach database event listeners.
             */
            registerDatabaseEventListeners(active.connection, options);

            return active;
        } catch (error) {
            /**
             * @var {number} exponentialDelay
             * 
             * The calculated exponential delay to apply before the next
             * connection attempt.
             */
            const exponentialDelay = options.baseDelayMs * (2 ** (attempt - 1));

            /**
             * @var {number} jitterMs
             * 
             * The randomized jitter value added to the base delay to
             * derive the exponential delay.
             */
            const jitter = Math.floor((Math.random() * 2 - 1) * options.jitterMs);

            /**
             * @var {number} delayMs
             * 
             * The base delay specifying the minimum amount of time that
             * must elapse before a new connection can be attempted.
             */
            const delayMs = Math.max(0, exponentialDelay + jitter);

            /**
             * Public message advising the user of a connection failure.
             */
            logMessage.warn(
                `[WARNING] >> Connection attempt ${attempt} failed! Retrying in ${Math.round(delayMs / 1000)} seconds...`
            );

            /**
             * Reattempt the connection is max attempts have not been
             * exhausted.
             */
            if (attempt < options.maxAttempts) {
                await enforceRetryDelay(delayMs);

                continue;
            }
            
            /**
             * Otherwise, output a public error message and private
             * error details.
             */
            else {
                logMessage.error(
                    `ERROR >> All ${options.maxAttempts} connection attempts failed.`
                )

                /**
                 * Private message with error details and stack when available.
                 */
                const timestamp = new Date().toISOString();
                isDevelopment && logMessage.error(
                    `[${timestamp}] ${error?.stack ? error.stack : String(error)}`
                );
            }

            /**
             * Trigger another small delay to attempt log flushing.
             */
            await enforceRetryDelay(100);

            /**
             * Throw custom error.
             */
            throw new DatabaseError(
                `A connection to the MongoDB database ${options.dbName} could not be established...`,
                500,
                error
            );
        }
    }
}
