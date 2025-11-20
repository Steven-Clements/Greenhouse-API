/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* index.js | {√}                                       @packageDocumentation *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* The main entry point for the Greenhouse API server. This file configures   *|
|* packages, initializes middleware, and specifies how to use these assets to *|
|* process and route requests to an appropriate controller.                   *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import express from 'express';
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import path from 'path';


/* —————————————————————————————————————————————————————————————————————————— *\
| Load environment variables                                                   |
\* —————————————————————————————————————————————————————————————————————————— */
dotenv.config();


/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import connectMongoDb from './system/connect-mongo-db.js';
import dispatchRequest from './routes/dispatch-request.js';
import log from './utilities/logger.js';
import registerSignalListeners from './system/signal-listeners.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Helper variables                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
const port = parseInt(process.env.PORT) || 5000;
const environment = process.env.NODE_ENV || 'development';
const basePath = process.env.RENDER_EXTERNAL_URL || process.env.BASE_PATH || 'http://localhost:5000';


/* —————————————————————————————————————————————————————————————————————————— *\
| Immediately Invoked Functional Expression (IIEF)                             |
\* —————————————————————————————————————————————————————————————————————————— */
(async () => {
    try {
        /* —————————————————————————————————————————————————————————————————————————— *\
        | Connect to MongoDB database                                                  |
        \* —————————————————————————————————————————————————————————————————————————— */
        const dbInfo = await connectMongoDb();


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Initialize Greenhouse application                                            |
        \* —————————————————————————————————————————————————————————————————————————— */
        const app = express();


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Initialize middleware                                                        |
        \* —————————————————————————————————————————————————————————————————————————— */
        app.use(express.json());
        app.use(express.urlencoded({
            extended: true
        }));


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Generate static views                                                        |
        \* —————————————————————————————————————————————————————————————————————————— */
        app.engine('hbs', engine({
            extname: '.hbs',
            defaultLayout: 'main',
            layoutsDir: path.join(process.cwd(), 'views', 'layouts')
        }));
        app.set('view engine', 'hbs');

        app.set('views', path.join(process.cwd(), 'views'))


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Define API routes                                                            |
        \* —————————————————————————————————————————————————————————————————————————— */
        app.use('/', dispatchRequest);


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Listen for requests                                                          |
        \* —————————————————————————————————————————————————————————————————————————— */
        const server = app.listen(port, () => {
            log('info',`Greenhouse API server started successfully in the "${environment}" environment.`);
            log('info', `Listening for requests at ${basePath}...`);
        });


        /* —————————————————————————————————————————————————————————————————————————— *\
        | Register OS signal listeners                                                 |
        \* —————————————————————————————————————————————————————————————————————————— */
        await registerSignalListeners(server, dbInfo.connection);
    } catch (bootError) {
        log ('error', `BOOT ERROR >> The server failed to start correctly.`, { cause: error });

        /* —————————————————————————————————————————————————————————————————————————— *\
        | Exit code 1 | Boot error                                                     |
        \* —————————————————————————————————————————————————————————————————————————— */
        process.exit(1);
    }
})();
