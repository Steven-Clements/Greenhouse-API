/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* @file User.js                                                              *|
|*                                                                            *|
|* Specifies the methods and properties representing a User resource in the   *|
|* application database.                                                      *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import mongoose from 'mongoose';
import argon2 from 'argon2';


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE VERIFICATION TOKEN SCHEMA                                            |
\* —————————————————————————————————————————————————————————————————————————— */
const VerificationTokenSchema = new mongoose.Schema({
    /* —— ⦿ —— ⦿ —— ⦿ —— { USER ID } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description A reference to the User that owns that token.
     * 
     * @required
     */
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    /**
     * @description Hashed version of the verification token.
     * 
     * @required
     */
    token: {
        type: String,
        required: true
    },
    /**
     * @description The reason for the token verification.
     * 
     * @default email_verification
     * @required
     * 
     * @enum - `email_verification`: Verify an email address.
     * - `account_recovery`: Verify an account recovery token.
     * - `multi_factor_verification`: Enroll for or trigger a multi-factor method.
     */
    purpose: {
        type: String,
        required: true,
        default: 'email_verification',
        enum: [
            'email_verification',
            'account_recovery',
            'multi_factor_verification'
        ]
    },
    /**
     * @description The date and time the token is considered invalid.
     * 
     * @required
     */
    expiresAt: {
        type: Date,
        required: true
    },
    /**
     * @description Specifies whether the token has been consumed.
     * 
     * @required
     */
    consumed: {
        type: Boolean,
        default: false
    },
    /**
     * @description The date and time the token was consumed.
     * 
     * @required
     */
    consumedAt: {
        type: Date
    },
    /**
     * @description The IP address of the device consuming the token.
     * 
     * @required
     */
    consumedByIp: {
        type: String
    }
}, {
    /* —— ⦿ —— ⦿ —— ⦿ —— { CREATED AT/UPDATED AT } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The date and time the token was created as well as the
     *      date and time token metadata was last updated.
     */
    timestamps: true
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE PRE-SAVE HOOKS                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
VerificationTokenSchema.pre('save', async function (next) {
    if (
        this.isModified('token') &&
        typeof this.token === 'string' &&
        this.token.trim() !== ''
    ) {
        this.token = await argon2.hash(this.token);
    }

    next();
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE MODEL                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
const VerificationToken = mongoose.model('VerificationToken', VerificationTokenSchema);


/* —————————————————————————————————————————————————————————————————————————— *\
|  EXPORT MODEL                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export default VerificationToken;
