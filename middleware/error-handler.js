/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `error-handler.js`   |   {√}                                               *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Processes errors to determine how the application should respond to the    *|
|* user.                                                                      *|
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
 * @module AuthorizationError
 * Throws errors when the user making the request does not have sufficient
 * permissions to access a resource.
 */
import AuthorizationError from '../errors/Authorization-Error.js';

/**
 * @module ConfigError
 * Throws errors when configuration values are missing or invalid.
 */
import ConfigError from '../errors/Config-Error.js';

/**
 * @module DatabaseError
 * Throws errors when the database encounters connectivity issues.
 */
import DatabaseError from '../errors/Database-Error.js';

/**
 * @module NotFoundError
 * Throws errors when a requested route is invalid or does not exist.
 */
import NotFoundError from '../errors/Not-Found-Error.js';

/**
 * @module logMessage
 * Logs messages at the resolved level and format.
 */
import logMessage from '../filesystem/logger.js';

/**
 * @module RequestError
 * Throws errors when an unexpected issue occurs during a request.
 */
import RequestError from '../errors/Request-Error.js';

/**
 * @module ValidationError
 * Throws errors when required request parameters are missing or invalid.
 */
import ValidationErr from '../errors/Validation-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  ERROR 404 HANDLER                                                           |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Generates an appropriate status code and error message when a non-existing
 * route is requested.
 * 
 * @param {Request} request
 * An HTTP-based request from the client to the server.
 * 
 * @param {Response} response
 * An HTTP-based response from the server to the client.
 * 
 * @param {Next} next
 * Call this function to proceed with the original request.
 */
export function error404Handler(request, response, next) {
    /* —— ⦿ —— ⦿ —— ⦿ —— { CREATE A NEW ERROR } —— ⦿ —— ⦿ —— ⦿ —— */
    const error = new NotFoundError(
        `Route not found: ${request.originalUrl}`,
        404,
        request.originalUrl
    );


    /* —— ⦿ —— ⦿ —— ⦿ —— { PROCEED TO ERROR HANDLER } —— ⦿ —— ⦿ —— ⦿ —— */
    next(error);
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  ERROR HANDLER                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function errorHandler
 * 
 * Generates an appropriate status code, error message, context, and stack
 * trace when an error is encountered by the server and outputs details as
 * appropriate based on the current environment (for example, development 
 * versus production).
 * 
 * @param {MongooseError|DotenvError|JsonWebTokenError|MulterError|Error}
 * 
 * @param {Request} request An HTTP-based request from the client to the
 *      server.
 * 
 * @param {Response} response An HTTP-based response from the server to the
 *      client.
 * 
 * @param {Next} next Call this function to proceed with the original request.
 */
export function errorHandler(error, request, response, next) {
    /* —— ⦿ —— ⦿ —— ⦿ —— { CREATE HELPFUL VARIABLES } —— ⦿ —— ⦿ —— ⦿ —— */
    let statusCode = response.statusCode === 200 ? 500 : response.statusCode;
    let message = error.message || 'An unexpected server error occurred. Please try your request again later.';
    let details = error?.details || null;
    let previous = error?.previous || null;

    
    /* —— ⦿ —— ⦿ —— ⦿ —— { CREATE ERROR CONTEXT } —— ⦿ —— ⦿ —— ⦿ —— */
    const errorContext = {
        timestamp: new Date().toISOString(),
        requestId: request.id || Math.random().toString(36).substring(7),
        method: request.method,
        path: request.originalUrl,
        userAgent: request.get('user-agent'),
        error: {
            name: error.name || 'Error',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
    };


    /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE CUSTOM ERRORS } —— ⦿ —— ⦿ —— ⦿ —— */
    if (error instanceof AuthorizationError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
        previous = error?.previous;
    }

    if (error instanceof ConfigError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
        previous = error?.previous;
    }

    if (error instanceof DatabaseError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
        previous = error?.previous;
    }

    if (error instanceof NotFoundError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
        previous = error?.previous;
    }

    if (error instanceof RequestError) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
        previous = error?.previous;
    }

    if (error instanceof ValidationErr) {
        statusCode = error.statusCode;
        message = error.message;
        details = error.details;
        previous = error?.previous;
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE DUPLICATE KEY ERRORS } —— ⦿ —— ⦿ —— ⦿ —— */
    if (error.code === 11000) {
        statusCode = 409;
        message = 'Resource already exists.';
        details = error.keyValue;
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE MONGOOSE ERRORS } —— ⦿ —— ⦿ —— ⦿ —— */
        /* —— ⦾ —— ⦾ —— ⦾ —— { Destructure mongoose errors } —— ⦾ —— ⦾ —— ⦾ —— */
        const { CastError, DivergentArrayError, DocumentNotFoundError, MissingSchemaError,
                MongooseBulkSaveIncompleteError, MongooseServerSelectionError,
                OverwriteModelError, ParallelSaveError, StrictModeError,
                StrictPopulateError, ValidationError, VersionError
            } = mongoose.Error;

        /* —— ⦾ —— ⦾ —— ⦾ —— { CastError } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof CastError && error.kind === 'ObjectId') {
            statusCode = 404;
            message = 'No resource found with the given ID.';
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { DivergentError } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof DivergentArrayError) {
            statusCode = 500;
            message = 'Modified an array projection in an unsafe way.';
        }

        if (error instanceof DocumentNotFoundError) {
            statusCode = 404;
            message = 'The `save` operation failed because the underlying document could not be found.';
        }

        if (error instanceof MissingSchemaError) {
            statusCode = 500;
            message = 'Tried to access a model that has not been registered.';
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { Mongoose Bulk Save Incomplete Error } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof MongooseBulkSaveIncompleteError) {
            statusCode = 500;
            message = 'One or more documents failed to save while executing the `bulkSave` operation.';
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { Mongoose Server Selection Error } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof MongooseServerSelectionError) {
            statusCode = 500;
            message = 'Node driver failed to connect to a valid server.';
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { Overwrite Model Error } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof OverwriteModelError) {
            statusCode = 500;
            message = 'Model already registered on the current connection.';
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { Parallel Save Error } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof ParallelSaveError) {
            statusCode = 500;
            message = 'The `save` operation was called multiple times on the same document.';
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { Strict Mode Error } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof StrictModeError) {
            statusCode = 500;
            message = 'Attempted to change immutable properties or pass values unspecified by the schema.';
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { Strict Populate Error } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof StrictPopulateError) {
            statusCode = 500;
            message = 'The `populate` operation failed because the path does not exist.';
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { Validation Error } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof ValidationError) {
            statusCode = 400;
            message = Object.values(error.errors)
                        .map(err => err.message)
                        .join(', ');
        }

        /* —— ⦾ —— ⦾ —— ⦾ —— { Version Error } —— ⦾ —— ⦾ —— ⦾ —— */
        if (error instanceof VersionError) {
            statusCode = 500;
            message = 'The `save` operation failed because the remote document was changed.';
        }

    /* —— ⦿ —— ⦿ —— ⦿ —— { LOG ERROR DETAILS } —— ⦿ —— ⦿ —— ⦿ —— */
    if (process.env.NODE_ENV === 'development') {
        logMessage.error(`✘ ERROR ✘ >>`, errorContext);
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN ERROR RESPONSE } —— ⦿ —— ⦿ —— ⦿ —— */
    response.status(statusCode).json({
        success: false,
        status: statusCode,
        message,
        requestId: errorContext.requestId,
        timestamp: errorContext.timestamp,
        path: errorContext.path,
        method: errorContext.method,
        previous,
        data: details || (process.env.NODE_ENV === 'development' ? error.stack : null)
    });
}
