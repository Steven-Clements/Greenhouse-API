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
import crypto from 'crypto';

import VerificationToken from './VerificationToken.js';
import saveOrFail from '../utilities/saveOrFail.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE USER SCHEMA                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
const UserSchema = new mongoose.Schema({
    /* —— ⦿ —— ⦿ —— ⦿ —— { STATUS } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description Specifies how the authentication system responds to a user's
     *      authentication request.
     * 
     * @default active
     * 
     * @enum - `active`: User is authenticated normally.
     * - `lock`: User is temporarily prevented from authenticating until
     *      the time in the `lockout_expires` property has passed.
     * - `suspend`: User is indefinitely prevented from authenticating
     *      until an administrator updates their status.
     * - `blacklist`: User is permanently banned from authenticating.
     * - `recovery`: User is referred to account recovery to complete
     *      an unfinished password reset request.
     */
    status: {
        type: String,
        required: true,
        enum: [
            'active',
            'lock',
            'suspend',
            'blacklist'
        ],
        default: 'active',
        index: true
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { ROLE } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description Determines which types of data and resources the User
     *      is allowed to view, create, update, and delete.
     * 
     * @default guardian
     * 
     * @enum - `guardian`: A legal guardian who is responsible for making
     *      education decisions on behalf of their child.
     * - `instructor`: A formally trained and licensed educator that
     *      hosts lessons on behalf of one or more children.
     * - `student`: A dependent child who is receiving homeschool-
     *      based education.
     * - `auditor`: A professional auditor or regulator who requires
     *      access to specific education logs and/or records.
     */
    role: {
        type: String,
        required: true,
        enum: [
            'guardian',
            'instructor',
            'student',
            'auditor'
        ],
        default: 'guardian'
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { PERMISSIONS } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description Determines which types of data and resources the User
     *      is allowed to view, create, update, and delete.
     * 
     * @default []
     */
    permissions: {
        type: [String],
        default: [],
        select: false
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { PROFILE PICTURE } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The server-generated filename the profile picture was
     *      saved under.
     * 
     * @default 'default.png'
     */
    profilePicture: {
        type: String,
        required: true,
        default: 'default.png'
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { NAME } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The first, middle, and/or last name as provided 
     *      by the user during registration or through a profile
     *      update.
     */
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
        match: /^[A-Za-z]+([ -][A-Za-z]+)*$/
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { USERNAME } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The unique username created by a user for
     *      authenticating to the application without an email
     *      address.
     */
    username: {
        type: String,
        required: true,
        index: true,
        unique: true,
        minLength: 2,
        maxLength: 16,
        match: /^[A-Za-z][A-Za-z0-9_-]{2,15}$/
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { EMAIL } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The unique email address designated by the
     *      user for authentication, account notifications, and
     *      advertisements.
     */
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        minLength: 8,
        maxLength: 254,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { EMAIL VERIFIED AT } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The data and time the user's email address was
     *      verified by the application.
     */
    emailVerifiedAt: {
        type: Date,
        default: null,
        index: true
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { PASSWORD } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description A private, user-specified value, used to authenticate the user
     *      to the application.
     */
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 64,
        select: false
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { IS MULTI-FACTOR ENABLED } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description Specifies whether or not the user has enabled (or if the
     *      application requires) multi-factor authentication. The default
     *      value for this property can be specified with the
     *      `AUTH_MFA_REQUIRED` option in `.env`.
     * 
     * @default process.env.MFA_REQUIRED
     */
    isMultiFactorEnabled: {
        type: Boolean,
        required: true,
        default: process.env.AUTH_MFA_REQUIRED === 'false'
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { LAST LOGIN IP } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The last known IP address from which the user signed
     *      in to the application successfully.
     */
    lastLoginIp: {
        type: String,
        select: false
    },

    /* —— ⦿ —— ⦿ —— ⦿ —— { LAST LOGIN AT } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The date and time of the user's last successful login.
     */
    lastLoginAt: {
        type: Date,
        index: true
    }
}, {
    /* —— ⦿ —— ⦿ —— ⦿ —— { CREATED AT/UPDATED AT } —— ⦿ —— ⦿ —— ⦿ —— */
    /**
     * @description The date and time the user was created as well as the
     *      date and time the user was last updated.
     */
    timestamps: true
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE PRE-SAVE HOOKS                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
UserSchema.pre('save', async function (next) {
    if (
		this.isModified('password') &&
		typeof this.password === 'string' &&
        this.password.trim() !== ''
	) {
        this.password = await argon2.hash(this.password);
    }

    next();
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE VIRTUALS                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
/* —— ⦿ —— ⦿ —— ⦿ —— { `isVerified` } —— ⦿ —— ⦿ —— ⦿ —— */
/**
 * @returns {Boolean} - True if the user's email address is verified or false
 *      if it is not verified.
 */
UserSchema.virtual('isVerified').get(function() {
    return Boolean(this.emailVerifiedAt);
});


/* —— ⦿ —— ⦿ —— ⦿ —— { `isLockoutExpired` } —— ⦿ —— ⦿ —— ⦿ —— */
/**
 * @returns {Boolean} - True if the user's lockout period has expired or false
 *      if it has not.
 */
UserSchema.virtual('isLockoutExpired').get(function() {
    return !!(this.lockoutExpiresAt && this.lockoutExpiresAt < Date.now());
});


/* —— ⦿ —— ⦿ —— ⦿ —— { `isLocked` } —— ⦿ —— ⦿ —— ⦿ —— */
/**
 * @returns {Boolean} - True if the user's account is locked or false if not.
 */
UserSchema.virtual('isLocked').get(function () {
    return this.status === 'lock' || (this.lockoutExpiresAt && this.lockoutExpiresAt > Date.now());
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE HELPER METHODS                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
UserSchema.methods.generateToken = async function (purpose) {
    switch (purpose) {
        case 'email_verification':
            const verificationCode = crypto.randomBytes(32).toString('hex');

            const token = new VerificationToken({
                userId: this._id,
                token: verificationCode,
                purpose: 'email_verification',
                expiresAt: Date.now() + 1000 * 60 * 60 * 24
            });

            await saveOrFail(token);

            return verificationCode;
    }
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE MODEL                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
const User = mongoose.model('User', UserSchema);


/* —————————————————————————————————————————————————————————————————————————— *\
|  EXPORT MODEL                                                                |
\* —————————————————————————————————————————————————————————————————————————— */
export default User;
