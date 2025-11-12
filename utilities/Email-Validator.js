/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* EmailValidator.js                                                          *|
|*                                                                            *|
|* Specifies validation rules for email address to conform with OWASP, NIST,  *|
|* and RFC recommendations and best practices.                                *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT FILES AND DEPENDENCIES                                               |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Validates an email address and ensures it conforms with formats specified
 * by OWASP and applicable RFCs.
 * 
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
 */
export default class EmailValidator {
    /**
     * Splits an email address into local and domain parts.
     * 
     * The local part and domain part are split based on recommendations specified in RFC 5321.
     * 
     * Note: The split used in this method is simplified and does not support quoted local
     * parts with `@`. This is a policy decision to improve overall security.
     * @see https://www.rfc-editor.org/rfc/rfc5321.txt
     * 
     * @param {string} email The email address requiring validation.
     * 
     * @returns {Record<string, string>} An object with separate local and domain values.
     */
    static getParts(email) {
        /* —— ⦿ —— ⦿ —— ⦿ —— { SPLIT EMAIL AT FINAL `@` } —— ⦿ —— ⦿ —— ⦿ —— */
        const atIndex = email.lastIndexOf('@');

        /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE `@` SYMBOL } —— ⦿ —— ⦿ —— ⦿ —— */
        if (atIndex === -1) {
            return { local: "", domain: "" };
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN LOCAL AND DOMAIN PARTS } —— ⦿ —— ⦿ —— ⦿ —— */
        return {
            local: email.slice(0, atIndex),
            domain: email.slice(atIndex + 1)
        };
    }

    /**
     * Rejects dangerous characters in the web and database context.
     * 
     * @param {string} email The email address requiring validation.
     * 
     * @returns {boolean} `true` if email contains forbidden characters; `false` if not.
     */
    static hasForbiddenCharacters(email) {
        /* —— ⦿ —— ⦿ —— ⦿ —— { FORBIDDEN CHARACTER REGEX } —— ⦿ —— ⦿ —— ⦿ —— */
        /**
         * Rejects quotes, backticks, ASCII control characters, whitespace, and null bytes.
         * 
         * Note: The `$` symbol is excluded here as a policy decision due to the
         * web context being a MERN-stack application.
         */
        const forbidden = /[\s$'"`\\\x00-\x1F]/;

        /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN RESULT } —— ⦿ —— ⦿ —— ⦿ —— */
        return forbidden.test(email);
    }

    /**
     * Determines whether an email address contains more than 254 characters.
     * 
     * The maximum character length is set based on recommendations specified in RFC 5321.
     * @see https://www.rfc-editor.org/rfc/rfc5321.txt
     * 
     * @param {string} email The email address requiring validation.
     * 
     * @returns {boolean} `true` if email has more than 254 characters; `false` if not.
     */
    static isTooLong(email) {
        /* —— ⦿ —— ⦿ —— ⦿ —— { MAXIMUM LENGTH } —— ⦿ —— ⦿ —— ⦿ —— */
        /**
         * Per RFC 5321: Maximum email length is 254 characters.
         */
        const maxLength = 254;

        /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN RESULT } —— ⦿ —— ⦿ —— ⦿ —— */
        return email.length > maxLength;
    }

    /**
     * Determines whether or not that domain part of an email address is valid.
     * 
     * Domain part validation is based on recommendations specified in RFC 1035 and 1123:
     *   - The full domain must not exceed 253 characters.
     *   - Each DNS label must be between 1 and 63 characters.
     *   - Labels must be alphanumeric, may contain hyphens, but cannot start or end
     *     a hyphen.
     *   - TLD must be alphabetic and contain between 2 and 63 characters.
     * 
     * Note: This method excludes punycode/IDN by design for simplicity.
     * @see https://www.rfc-editor.org/rfc/rfc1035.txt
     * @see https://www.rfc-editor.org/rfc/rfc1123.txt
     * 
     * @param {string|undefined} domain The domain part of the email requiring validation.
     * 
     * @returns {boolean} `true` if the domain part is valid; `false` if not.
     */
    static isValidDomainPart(domain) {
        /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE MISSING DOMAIN PART } —— ⦿ —— ⦿ —— ⦿ —— */
        if (!domain) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE INVALID DOMAIN LENGTH } —— ⦿ —— ⦿ —— ⦿ —— */
        if (domain.length > 253) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { SPLIT MULTIPLE `.` DOMAINS } —— ⦿ —— ⦿ —— ⦿ —— */
        const labels = domain.split('.');

        /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE INVALID DOMAIN LENGTH } —— ⦿ —— ⦿ —— ⦿ —— */
        if (labels.some(l => l.length === 0 || l.length > 63)) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { DOMAIN PART REGEX } —— ⦿ —— ⦿ —— ⦿ —— */
        if (!labels.every(l => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(l))) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { ISOLATE THE TLD } —— ⦿ —— ⦿ —— ⦿ —— */
        const tld = labels[labels.length - 1];

        /* —— ⦿ —— ⦿ —— ⦿ —— { TLD REGEX } —— ⦿ —— ⦿ —— ⦿ —— */
        if (!/^[A-Za-z]{2,63}$/.test(tld)) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN RESULT } —— ⦿ —— ⦿ —— ⦿ —— */
        return true;
    }

    /**
     * Determines whether or not that local part of an email address is valid.
     * 
     * Local part validation is based on recommendations specified in RFC 5321 and 5322:
     *   - Cannot start or end with a period.
     *   - Cannot contain consecutive periods.
     *   - Must contain 63 characters or less.
     *   - Allow alphanumeric characters with periods, underscores, and percentage,
     *     addition, and subtraction symbols.
     * @see https://www.rfc-editor.org/rfc/rfc5321.txt
     * @see https://www.rfc-editor.org/rfc/rfc5322.txt
     * 
     * @param local The local part of the email requiring validation.
     * 
     * @returns `true` if the local part is valid; `false` if not.
     */
    static isValidLocalPart(local) {
        /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE MISSING LOCAL PART } —— ⦿ —— ⦿ —— ⦿ —— */
        if (!local) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE LEADING AND TRAILING PERIODS } —— ⦿ —— ⦿ —— ⦿ —— */
        if (local.startsWith('.') || local.endsWith('.')) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE CONSECUTIVE PERIODS } —— ⦿ —— ⦿ —— ⦿ —— */
        if (local.includes('..')) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { HANDLE INVALID LENGTH } —— ⦿ —— ⦿ —— ⦿ —— */
        if (local.length > 63) {
            return false;
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { LOCAL PART REGEX } —— ⦿ —— ⦿ —— ⦿ —— */
        return /^[A-Za-z0-9]+(?:[._%+-][A-Za-z0-9]+)*$/.test(local);
    }

    /**
     * Performs comprehensive email validation and returns the results.
     * 
     * @param {string} email The email address requiring validation.
     * 
     * @returns {Record<string, any>} An object with the `valid` (and `reason` if error) property.
     */
    validate(email) {
        /* —— ⦿ —— ⦿ —— ⦿ —— { CHECK THE DATA TYPE } —— ⦿ —— ⦿ —— ⦿ —— */
        if (typeof email !== 'string') {
            return {
                valid: false,
                reason: 'Incorrect data type. Must contain a string value.'
            };
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { NORMALIZE EMAIL ADDRESS } —— ⦿ —— ⦿ —— ⦿ —— */
        const value = email.trim().toLowerCase();

        /* —— ⦿ —— ⦿ —— ⦿ —— { CHECK THAT EMAIL IS SET } —— ⦿ —— ⦿ —— ⦿ —— */
        if (value.length === 0) {
            return {
                valid: false,
                reason: 'The `email` parameter is required.'
            };
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { CHECK IF TOO LONG } —— ⦿ —— ⦿ —— ⦿ —— */
        if (EmailValidator.isTooLong(value)) {
            return {
                valid: false,
                reason: 'Invalid length. Must contain a value with 254 characters or less.'
            };
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { CHECK FOR FORBIDDEN CHARACTERS  } —— ⦿ —— ⦿ —— ⦿ —— */
        if (EmailValidator.hasForbiddenCharacters(value)) {
            return {
                valid: false,
                reason: 'Invalid characters. Cannot contain quotes, backticks, backslashes, whitespace, or ASCII control characters.'
            };
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { SPLIT DOMAIN AND LOCAL PARTS } —— ⦿ —— ⦿ —— ⦿ —— */
        const { local, domain } = EmailValidator.getParts(value);

        /* —— ⦿ —— ⦿ —— ⦿ —— { CHECK THAT LOCAL PART IS VALID } —— ⦿ —— ⦿ —— ⦿ —— */
        if (!EmailValidator.isValidLocalPart(local)) {
            return {
                valid: false,
                reason: 'Invalid local part. Cannot begin or end with a period, contain consecutive periods, or contain more than 63 characters.'
            };
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { CHECK THAT DOMAIN PART IS VALID } —— ⦿ —— ⦿ —— ⦿ —— */
        if (!EmailValidator.isValidDomainPart(domain)) {
            return {
                valid: false,
                reason: 'Invalid domain part. Each label must contain 1-63 characters, consist of letters, numbers, or hyphens, and the domain must end with a valid TLD.'
            };
        }

        /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN RESULT } —— ⦿ —— ⦿ —— ⦿ —— */
        return { valid: true };
    }
}
