/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* @file validationHandler.js                                                 *|
|*                                                                            *|
|* Validates requests against validation rules and custom validators.         *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
| IMPORT DEPENDENCIES                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @package express-validator
 * @see https://www.npmjs.com/package/express-validator
 */
import { body, validationResult } from 'express-validator';

/**
 * @module EmailValidator
 * Validates an email address and ensures it conforms with formats specified
 * by OWASP and applicable RFCs.
 */
import EmailValidator from '../utilities/EmailValidator.js';

/**
 * @module ValidationError
 * Throws errors when required request parameters are missing or invalid.
 */
import ValidationError from '../errors/Validation-Error.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| VALIDATE EMAIL ADDRESSES AGAINST OWASP/NIST/RFC                              |
\* —————————————————————————————————————————————————————————————————————————— */
export const validateEmail = body('email').custom(value => {
    const result = new EmailValidator().validate(value);

    if (!result.valid) {
        throw new ValidationError(
            'One or more validation error(s) occurred.',
            400,
            result.reason
        );
    }

    return true;
});


/* —————————————————————————————————————————————————————————————————————————— *\
| VALIDATE PHONE NUMBERS AGAINST E.164                                         |
\* —————————————————————————————————————————————————————————————————————————— */
export const validatePhone = body('phone').optional().custom(value => {
    const e164Regex = /^\+[1-9]\d{1,14}$/;

    if (!value.match(e164Regex)) {
        throw new ValidationError(
            'One or more validation error(s) occurred.',
            400,
            result.reason
        );
    }

    return e164Regex.test(phoneNumber);
});


/* —————————————————————————————————————————————————————————————————————————— *\
| VALIDATE REQUEST                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
const validateRequest = (request, response, next) => {
    const errors = validationResult(request);
    
    if (!errors.isEmpty()) {
        throw new ValidationError(
            'One or more validation error(s) occurred.',
            400,
            result.reason
        );
    }

    next();
}

export default validateRequest;
