# Developer log

This log describes changes across the Greenhouse API project during the development phase of the project.

## [0.0.3] - 19 September 2025

This commit introduces robust MongoDB connection management (`connect-mongo-db.js`) with automated retries and exponential backoff, along with event listeners (`mongo-db-listeners.js`) for improved observability.

Error handling and shutdown logic have been updated to integrate the new database connection lifecycle, ensuring graceful termination and consistent logging across the system.

- **Commit message**: `Add MongoDB connection | MongoDB Listeners | Update error handler`

### Added

- Created a new `mongo-db-listeners.js` to listen for database connection events and log them.
- Created a new `connect-mongo-db.js` to establish a persistent connection to MongoDB with automated retries and exponential backoff.

### Changed

- Updated `error-handler.js` to pass context to the updated logger correctly.
- Updated `index.js` to call the new connection function.
- Updated `signal-listeners.js` to pass the database connection to graceful shutdown.
- Updated `graceful-shutdown.js` to close the database connection in addition to its other tasks.

### Directory structure

```txt
[greenhouse-api]
    |-- [errors]
    |       |-- Api-Error.js
    |       |-- Auth-Error.js
    |       |-- Bad-Request-Error.js
    |       |-- Config-Error.js
    |       |-- Database-Error.js
    |       |-- Invalid-Parameter-Error.js
    |       |-- Not-Found-Error.js
    |-- [logs]
    |-- [node_modules]
    |-- [middleware]
    |       |-- error-handler.js
    |-- [routes]
    |       |-- dispatch-request.js
    |       |-- static-routes.js
    |       |-- v1-routes.js
    |-- [system]
    |       |-- connect-mongo-db.js
    |       |-- graceful-shutdown.js
    |       |-- mongo-db-listeners.js
    |       |-- signal-listeners.js
    |-- [utilities]
    |       |-- logger.js
    |-- .env
    |-- .gitignore
    |-- .markdownlint.json
    |-- developer-log.md
    |-- index.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
```

## [0.0.2] - 18 September 2025

This commit was dedicated to the partial modularization of the entry point. New files were created to modularize OS termination signal listeners (`signal-listeners.js`) and attempt graceful shutdowns. (`graceful-shutdown.js`).

Introduced custom error classes for production-grade error handling, including `Api-Error.js`, `Auth-Error.js`, `Bad-Request-Error.js`, `Config-Error.js`, `Database-Error.js`, `Invalid-Parameter-Error.js`, and `Not-Found-Error.js`. Created custom error-handling middleware to generate error messages in the console, logs, and API response, based on the current environment.

- **Commit message**: `Modularize entry point | Custom errors | Error handler`

### Added

- Created a new `Not-Found-Error.js` for custom errors involving non-existing routes.
- Created a new `Invalid-Parameter-Error.js` for custom errors involving client requests with missing or invalid parameters.
- Created a new `Database-Error.js` for custom database connectivity and query errors.
- Created a new `Config-Error.js` for custom configuration property errors.
- Created a new `Bad-Request-Error.js` for unexpected errors that occur during API requests from clients.
- Created a new `Auth-Error.js` for custom authentication and authorization errors.
- Created a new `Api-Error.js` as a base class for custom errors in the Greenhouse API.
- Created a new `error-handler.js` to act as the error boundary and primary error handler for the application.
- Created a new `.markdownlint.json` to enforce custom linting rules for markdown files.
- Created a new `signal-listeners.js` to listen for OS termination signals and trigger graceful shutdowns.
- Created a new `graceful-shutdown.js` to attempt to flush logs, close connections, and ensure a server timeout is set.

### Changed

- Updated `logger.js` to accommodate new error handling methods.
- Updated `index.js` to remove existing signal listening and shutdown logic from the entry point into separate files.

### Directory structure

```txt
[greenhouse-api]
    |-- [errors]
    |       |-- Api-Error.js
    |       |-- Auth-Error.js
    |       |-- Bad-Request-Error.js
    |       |-- Config-Error.js
    |       |-- Database-Error.js
    |       |-- Invalid-Parameter-Error.js
    |       |-- Not-Found-Error.js
    |-- [logs]
    |-- [node_modules]
    |-- [middleware]
    |       |-- error-handler.js
    |-- [routes]
    |       |-- dispatch-request.js
    |       |-- static-routes.js
    |       |-- v1-routes.js
    |-- [system]
    |       |-- graceful-shutdown.js
    |       |-- signal-listeners.js
    |-- [utilities]
    |       |-- logger.js
    |-- .env
    |-- .gitignore
    |-- .markdownlint.json
    |-- developer-log.md
    |-- index.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
```

## [0.0.1] — 17 September 2025

This commit was dedicated to setting up the project and writing boilerplate code (`index.js`) for the Express application. Added new version control (`.gitignore`), environment (`.env`), and documentation files (`developer-log.md` and `README.md`).

Initialized a new Node.js project and installed the NPM dependencies planned for use in the project. This generated standard `package.json`, `package-lock.json` files and a `node_modules` directory. Added `start` and `server` script to the `package.json` file.

Created a logging utility (`logger.js`) using the `winston` package and enabled daily rotation of log and error files. Created initial routing files to handle general routing (`dispatch-request.js`) to static routes (`static-routes.js`) and API endpoints (`v1-routes.js`).

- **Commit message**: `Initial commit | Project setup | Express boilerplate | Logging | Routing`

### Added

Added the following files as part of this commit:

- Created a `[logs]` directory to store rotating log files.
- Created a new `v1-routes.js` to route API requests to an appropriate endpoint.
- Created a new `static-routes.js` to create static resources route requests to handlebars views.
- Created a new `dispatch-request.js` to route requests to static resources and API endpoints.
- Created a new `index.js` to serve as the entry point for the Greenhouse API.
- Created a new `logger.js` to log requests to the console and to rotating files.
- Created a new `README.md` for project overview and getting started documentation.
- Automatically generated a new `package-lock.json` file and `[node_modules]` directory by installing dependencies.
- Automatically generated a new `package.json` file with the `npm init` command.
- Created a new `.gitignore` file to prevent sensitive files from pushing to the git repository.
- Created a new `.env` file to store credentials, environment-specific configuration, and service details.
- Created a new `developer-log.md` to track development progress across commits.

#### Runtime dependencies

These runtime dependencies were installed as part of initial setup, though not all are yet integrated:

- [argon2](https://www.npmjs.com/package/argon2)
- [cookie-parser](https://www.npmjs.com/package/cookie-parser)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express](https://www.npmjs.com/package/express)
- [express-handlebars](https://www.npmjs.com/package/express-handlebars)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [handlebars](https://www.npmjs.com/package/handlebars)
- [helmet](https://www.npmjs.com/package/helmet)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [multer](https://www.npmjs.com/package/multer)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [qrcode](https://www.npmjs.com/package/qrcode)
- [speakeasy](https://www.npmjs.com/package/speakeasy)
- [uuid](https://www.npmjs.com/package/uuid)
- [winston](https://www.npmjs.com/package/winston)

#### Developer dependencies

These developer dependencies were installed as part of initial setup, though not all are yet integrated:

- [concurrently](https://www.npmjs.com/package/concurrently)
- [jest](https://www.npmjs.com/package/jest)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [supertest](https://www.npmjs.com/package/supertest)

### Directory structure

```txt
[greenhouse-api]
    |-- [logs]
    |-- [node_modules]
    |-- [routes]
    |       |-- dispatch-request.js
    |       |-- static-routes.js
    |       |-- v1-routes.js
    |-- [utilities]
    |       |-- logger.js
    |-- .env
    |-- .gitignore
    |-- developer-log.md
    |-- index.js
    |-- package-lock.json
    |-- package.json
    |-- README.md
```
