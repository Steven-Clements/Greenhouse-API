/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* error-handler.js | {√}/middleware                                          *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Defines custom errors and error messages for common errors encountered     *|
|* with the server, third-party packages, and during requests.                *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author: Steven "Chris" Clements <clements.steven07@outlook.com>           *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import {
    JsonWebTokenError,
    TokenExpiredError,
    NotBeforeError
} from 'jsonwebtoken';
import { MulterError } from 'multer';
import mongoose from 'mongoose'


/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import ApiError from '../errors/Api-Error.js';
import AuthError from '../errors/Auth-Error.js';
import BadRequestError from '../errors/Bad-Request-Error.js';
import ConfigError from '../errors/Config-Error.js';
import DatabaseError from '../errors/Database-Error.js';
import InvalidParameterError from '../errors/Invalid-Parameter-Error.js';
import NotFoundError from '../errors/Not-Found-Error.js';
import log from '../utilities/logger.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Destructure errors                                                           |
\* —————————————————————————————————————————————————————————————————————————— */
const {
    CastError,
    DivergentArrayError,
    DocumentNotFoundError,
    MissingSchemaError,
    MongooseBulkSaveIncompleteError,
    MongooseServerSelectionError,
    OverwriteModelError,
    ParallelSaveError,
    StrictModeError,
    StrictPopulateError,
    ValidationError,
    VersionError
} = mongoose.Error;


/* —————————————————————————————————————————————————————————————————————————— *\
| Error 404 handler                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module error404Handler
 * 
 * Generates an appropriate status code and error message when a user requests
 * a URI that does not map to any routes.
 * 
 * @param {import('express').Request} req
 * An HTTP-based request from the client to the server.
 *  
 * @param {import('express').Response} res
 * An HTTP-based response from the server to the client.
 *  
 * @param {import('express').NextFunction} next
 * Pass the error to the next middleware function (errorHandler).
 */
function error404Handler(req, res, next) {
    const error = new InvalidUriError(
        `The requested URI, "${req.originalUrl}", does not exist.`,
        404
    );

    next(error);
}


/* —————————————————————————————————————————————————————————————————————————— *\
| Error handler                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module errorHandler
 * 
 * Generates an appropriate status code and error message when an error occurs
 * within the application, and creates a detailed response to log and send as
 * a response.
 * 
 * @param {
 *      ApiError|
 *      AuthError|
 *      ConfigError|
 *      DatabaseError|
 *      NotFoundError|
 *      BadRequestError|
 *      InvalidParameterError|
 *      Argon2Error|
 *      VerificationError|
 *      RateLimitError|
 *      TokenExpiredError|
 *      JsonWebTokenError|
 *      NotBeforeError|
 *      CastError|
 *      DivergentArrayError|
 *      DocumentNotFoundError|
 *      MissingSchemaError|
 *      MongooseBulkSaveIncompleteError|
 *      MongooseServerSelectionError|
 *      OverwriteModelError|
 *      ParallelSaveError|
 *      StrictModeError|
 *      StrictPopulateError|
 *      ValidationError|
 *      VersionError|
 *      MulterError|
 *      NodemailerError|
 *      WinstonError|
 *      TypeError|
 *      ReferenceError|
 *      SyntaxError|
 *      RangeError|
 *      UriError|
 *      Error
 * } error
 * The error that requires additional handling.
 * 
 * @param {import('express').Request} req
 * An HTTP-based request from the client to the server.
 *  
 * @param {import('express').Response} res
 * An HTTP-based response from the server to the client.
 *  
 * @param {import('express').NextFunction} next
 * Pass the error to the next middleware function (errorHandler).
 * 
 * @returns {import('express').Response}
 * A JSON encoded error response sent back to the client.
 */
function errorHandler(error, req, res, next) {
    let name = error.name;
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let details = null;
    let message = error.message || 'An unexpected server error occurred. Please try again later.';
    let cause = error.cause || null;

    /* —— ⦿ —— ⦿ —— ⦿ —— { Custom errors } —— ⦿ —— ⦿ —— ⦿ —— */
    if (error instanceof ApiError) {
        name = error.name,
        statusCode = error.statusCode,
        message = error.message,
        details = error?.details,
        cause = error?.cause
    } else if (error instanceof AuthError) {
        name = error.name,
        statusCode = error.statusCode,
        message = error.message,
        details = error?.details,
        cause = error?.cause
    } else if (error instanceof BadRequestError) {
        name = error.name,
        statusCode = error.statusCode,
        message = error.message,
        details = error?.details,
        cause = error?.cause
    } else if (error instanceof ConfigError) {
        name = error.name,
        statusCode = error.statusCode,
        message = error.message,
        details = error?.details,
        cause = error?.cause
    } else if (error instanceof DatabaseError) {
        name = error.name,
        statusCode = error.statusCode,
        message = error.message,
        details = error?.details,
        cause = error?.cause
    } else if (error instanceof InvalidParameterError) {
        name = error.name,
        statusCode = error.statusCode,
        message = error.message,
        details = error?.details,
        cause = error?.cause
    } else if (error instanceof NotFoundError) {
        name = error.name,
        statusCode = error.statusCode,
        message = error.message,
        details = error?.details,
        cause = error?.cause
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Argon2 errors } —— ⦿ —— ⦿ —— ⦿ —— */
    else if (error.name === 'Argon2Error') {
        statusCode = 401;
        message = 'Invalid identifier or credentials. Access denied.'
    } else if (error.name === 'VerificationError') {
        statusCode = 401;
        message = 'Invalid identifier or credentials. Access denied.'
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Jsonwebtoken errors } —— ⦿ —— ⦿ —— ⦿ —— */
    else if (error instanceof TokenExpiredError) {
        statusCode = 401;
        message = 'Authorization token has expired. Access denied.';
    } else if (error instanceof NotBeforeError) {
        statusCode = 401;
        message = 'Authorization token is not yet active. Access denied.';
    } else if (error instanceof JsonWebTokenError) {
        statusCode = 401;
        message = 'Invalid authorization token. Access denied.'
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Mongoose errors } —— ⦿ —— ⦿ —— ⦿ —— */
    if (error instanceof CastError && error.kind === 'ObjectId') {
        statusCode = 404;
        message = 'No resource found with the given ID.';
    } else if (error instanceof DivergentArrayError) {
        statusCode = 500;
        message = 'Modified an array projection in an unsafe way.';
    } else if (error instanceof DocumentNotFoundError) {
        statusCode = 404;
        message = 'The `save` operation failed because the underlying document could not be found.';
    } else if (error instanceof MissingSchemaError) {
        statusCode = 500;
        message = 'Tried to access a model that has not been registered.';
    } else if (error instanceof MongooseBulkSaveIncompleteError) {
        statusCode = 500;
        message = 'One or more documents failed to save while executing the `bulkSave` operation.';
    } else if (error instanceof MongooseServerSelectionError) {
        statusCode = 500;
        message = 'Node driver failed to connect to a valid server.';
    } else if (error instanceof OverwriteModelError) {
        statusCode = 500;
        message = 'Model already registered on the current connection.';
    } else if (error instanceof ParallelSaveError) {
        statusCode = 500;
        message = 'The `save` operation was called multiple times on the same document.';
    } else if (error instanceof StrictModeError) {
        statusCode = 500;
        message = 'Attempted to change immutable properties or pass values unspecified by the schema.';
    } else if (error instanceof StrictPopulateError) {
        statusCode = 500;
        message = 'The `populate` operation failed because the path does not exist.';
    } else if (error instanceof ValidationError) {
        statusCode = 400;
        message = Object.values(error.errors)
                    .map(err => err.message)
                    .join(', ');
    } else if (error instanceof VersionError) {
        statusCode = 500;
        message = 'The `save` operation failed because the remote document was changed.';
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Multer errors } —— ⦿ —— ⦿ —— ⦿ —— */
    else if (error instanceof MulterError) {
        statusCode = 400;
        message = 'Failed to upload the specified file(s).';
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Nodemailer errors } —— ⦿ —— ⦿ —— ⦿ —— */
    else if (error instanceof Error && error.code === 'EAUTH') {
        statusCode = 502;
        message = 'Authentication failed for SMTP connection.'
    } else if (error instanceof Error && error.code === 'ECONNECTION') {
        statusCode = 502;
        message = 'Failed to establish a connection with the SMTP server.';
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { QRcode errors } —— ⦿ —— ⦿ —— ⦿ —— */
    else if (error instanceof Error && error.message.includes('QR')) {
        statusCode = 500;
        message = 'Failed to load QR code for Authenticator setup.';
    }
    
    /* —— ⦿ —— ⦿ —— ⦿ —— { Speakeasy errors } —— ⦿ —— ⦿ —— ⦿ —— */
    else if (error instanceof Error && error.message.includes('totp')) {
        statusCode = 500;
        message = 'Failed to deliver TOTP code for Authenticator verification.';
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Winston errors } —— ⦿ —— ⦿ —— ⦿ —— */
    else if (error instanceof Error && error.name === 'WinstonError') {
        statusCode = 500;
        message = 'An error occurred while attempting to log a message';
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Native JavaScript errors } —— ⦿ —— ⦿ —— ⦿ —— */
    else if (error instanceof ReferenceError) {
        statusCode = 500;
        message = 'Invalid reference to a non-existing variable.';
    }

    else if (error instanceof TypeError) {
        statusCode = 500;
        message = 'Attempted an operation on an incompatible object.';
    }

    else if (error instanceof SyntaxError) {
        statusCode = 500;
        message = 'Attempts to parse invalid JavaScript syntax.';
    }

    else if (error instanceof RangeError) {
        statusCode = 400;
        message = 'Specified a value outside of the defined range.';
    }

    else if (error instanceof URIError) {
        statusCode = 400;
        message = 'Invalid URL.'
    }

    else if (error instanceof Error) {
        statusCode = 500;
        message = 'An unexpected server error occurred. Please try your request again later.'
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Log error details (development) } —— ⦿ —— ⦿ —— ⦿ —— */
    if (process.env.NODE_ENV === 'development') {
        log('error', error.message, { context: errorContext })
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Error context } —— ⦿ —— ⦿ —— ⦿ —— */
    const errorContext = {
        timestamp: new Date().toISOString(),
        requestId: req.id || Math.random().toString(36).substring(7),
        method: req.method,
        path: req.originalUrl,
        userAgent: req.get('user-agent'),
        ipAddress: req.ip,
        error: {
            name,
            statusCode,
            message,
            details,
            cause
        }
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { Return error response } —— ⦿ —— ⦿ —— ⦿ —— */
    return res.status(statusCode).json({
        success: false,
        timestamp: errorContext.timestamp,
        requestId: errorContext.requestId,
        method: errorContext.method,
        path: errorContext.path,
        userAgent: errorContext.userAgent,
        ipAddress: errorContext.ipAddress,
        error: {
            name: errorContext.error.name,
            statusCode: errorContext.error.statusCode,
            message: errorContext.error.message,
            details: process.env.NODE_ENV === 'development' && errorContext.error.details,
            cause: process.env.NODE_ENV === 'development' && errorContext.error.cause
        }
    });
}


/* —————————————————————————————————————————————————————————————————————————— *\
| Export modules                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
export {
    error404Handler,
    errorHandler
}
