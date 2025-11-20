/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* mongo-db-listeners.js | {√}/system                                         *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Listens for database connection events and triggers automated reconnection *|
|* attempts when the database experiences an unexpected disconnection.        *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import log from "../utilities/logger.js";


/* —————————————————————————————————————————————————————————————————————————— *\
|  MongoDB Listeners                                                           |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function registerMongoDbListeners
 *
 * Listens for connections events and responds to unexpected disconnections
 * by attempting to reconnect to the database.
 *
 * @param {mongoose.Connection} connection
 * The connection triggering the disconnection event.
 */
export default function registerMongoDbListeners(connection) {

    connection.on('disconnected', async () => {
        log('warn', 'MongoDB database disconnected unexpectedly. Attempting to reconnect...');
    });

    connection.on('reconnected', () => {
        log('info', 'Reestablished MongoDB database connection successfully.');
    });

    connection.on('error', (error) => {
        log('error', 'Failed to reestablish a connection to the MongoDB database...', { cause: error });
    });
}
