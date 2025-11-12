/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* `validate-config.js`   |   {√}                                             *|
|* —————————————————————————————————————————————————————————————————————————— *| 
|* Validates configuration from `process.env` to determine if required        *|
|* properties are present.                                                    *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @module ensureOrFail
 * Determines whether the specified parameter is a valid and present value
 * or throws an error if the value is missing or invalid.
 */
import ensureOrFail from '../utilities/ensure-or-fail.js';

/**
 * @module EmailValidator
 * Validates an email address and ensures it conforms with formats specified
 * by OWASP and applicable RFCs.
 */
import EmailValidator from '../utilities/Email-Validator.js';

/**
 * @module ValidationError
 * Throws errors when required request parameters are missing or invalid.
 */
import ValidationError from '../errors/Validation-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  INITIALIZE CLASSES                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
const emailValidator = new EmailValidator()


/* —————————————————————————————————————————————————————————————————————————— *\
|  VALIDATE CONFIG                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @function validateConfig
 * 
 * Ensures that application-critical environment variables are loaded into
 * process.env.
 */
export default function validateConfig() {
    /* —— ⦾ —— ⦾ —— ⦾ —— { General requirements } —— ⦾ —— ⦾ —— ⦾ —— */
    ensureOrFail(process.env.NODE_ENV, 'NODE_ENV');
    ensureOrFail(process.env.PORT, 'PORT');
    ensureOrFail(process.env.VERSION_PATH, 'VERSION_PATH');
    ensureOrFail(process.env.MONGO_URI, 'MONGO_URI');
    ensureOrFail(process.env.DB_NAME, 'DB_NAME');
    ensureOrFail(process.env.MAIL_HOST, 'MAIL_HOST');
    ensureOrFail(process.env.MAIL_PORT, 'MAIL_PORT');
    ensureOrFail(process.env.MAIL_SECURE, 'MAIL_SECURE');

    console.log(process.env.MAIL_USER);

    ensureOrFail(process.env.MAIL_USER, 'MAIL_USER');
    const result = emailValidator.validate(process.env.MAIL_USER);
    if (!result.valid) {
        throw new ValidationError(
            'Invalid email address set for "MAIL_USER".',
            400,
            result.reason
        );
    }

    ensureOrFail(process.env.MAIL_PASS, 'MAIL_PASS')
    ensureOrFail(process.env.LOG_LEVEL, 'LOG_LEVEL');
    ensureOrFail(process.env.LOG_FORMAT, 'LOG_FORMAT');

    if (process.env?.MAIL_REPLY_TO !== undefined && process.env?.MAIL_REPLY_TO !== '' && process.env.MAIL_REPLY_TO !== null) {
        ensureOrFail(process.env.MAIL_REPLY_TO, 'MAIL_REPLY_TO');
    }


    /* —— ⦾ —— ⦾ —— ⦾ —— { Development requirements } —— ⦾ —— ⦾ —— ⦾ —— */
    if (process.env.NODE_ENV === 'development') {
        ensureOrFail(process.env.BASE_PATH, 'BASE_PATH');
    }

    /* —— ⦾ —— ⦾ —— ⦾ —— { Production requirements } —— ⦾ —— ⦾ —— ⦾ —— */
    if (process.env.NODE_ENV === 'production') {
        ensureOrFail(process.env.RENDER_EXTERNAL_URL, 'RENDER_EXTERNAL_URL');
    }
}
