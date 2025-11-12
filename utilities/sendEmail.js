/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* sendEmail.js                                                               *|
|*                                                                            *|
|* Delivers outbound emails to subscribers and developers for notification,   *|
|* alerts, email verification, authentication, and general communications.    *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import nodemailer from 'nodemailer';

import renderEmailTemplate from '../filesystem/renderEmailTemplates.js';
import logger from '../filesystem/logger.js';
import RequestError from '../errors/RequestError.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE GLOBAL VARIABLES                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
const basePath = process.env.RENDER_EXTERNAL_URL || process.env.BASE_PATH || 'http://localhost';
const port = process.env.PORT || 5000;
const versionPath = process.env.VERSION_PATH || '/api/v1';
const clientUrl = process.env.CLIENT_URL;
let transporter;


/* —————————————————————————————————————————————————————————————————————————— *\
|  CREATE TRANSPORTER                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
try {
    transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: Number(process.env.MAIL_PORT) === 465,
        auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
        }
    });
} catch (error) {
    logger.error('✘ ERROR ✘ >> Email delivery failed', { error: error.message });

    throw new RequestError(
        `Failed to initialize email transporter`,
        500,
        error.stack || error.message
    );
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  `sendEmailVerification`                                                     |
|  ——————————————————————————————————————————————————————————————————————————  |
|  Deliver a verification code to the specified email address and embed it in  |
|  a link so the user can easily verify access to their account.               |
\* —————————————————————————————————————————————————————————————————————————— */
/* —— ⦿ —— ⦿ —— ⦿ —— { `sendEmailVerification` } —— ⦿ —— ⦿ —— ⦿ —— */
/**
 * @param {String} email The email address where the message should be sent.
 * 
 * @param {String} verificationCode Randomly generated, cryptographically
 *      secure verification code to send as part of the message.
 */
export async function sendEmailVerification(email, userId, verificationCode) {
    /* —— ⦿ —— ⦿ —— ⦿ —— { RENDER TEMPLATE (HANDLEBARS) } —— ⦿ —— ⦿ —— ⦿ —— */
    const link = `${basePath}:${port}${versionPath}/email/verify?userId=${userId}&token=${verificationCode}`;
    const htmlContent = renderEmailTemplate('verifyEmail', {
        link,
        supportUrl: `${clientUrl}/support`
    });


    
    /* —— ⦿ —— ⦿ —— ⦿ —— { DEFINE ADDRESSES AND CONTENTS } —— ⦿ —— ⦿ —— ⦿ —— */
    const deliveryStatus = await transporter.sendMail({
        from: `"Greenhouse Support" <${process.env.MAIL_USER}>`,
        to: email,
        replyTo: process.env.MAIL_REPLY_TO,
        subject: '✔ Verify your email address',

        text: `Welcome and thank you for your interest in Greenhouse. Click the link below to verify your email address:
        
        ${link}
        
        If you did not make this request, feel free to let our support team know at ${htmlContent.supportUrl} and we'll look into it for you.
        
        Thanks,
        
        Greenhouse Product Team`,
        html: htmlContent
    });


    /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN DELIVERY DETAILS } —— ⦿ —— ⦿ —— ⦿ —— */
    return deliveryStatus;
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  `sendAccountReminder`                                                       |
|  ——————————————————————————————————————————————————————————————————————————  |
|  Deliver an email message advising an existing user about their account.     |
|  This function is typically used when a user attempts to register for an     |
|  account with an email address that is already stored in the database.       |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @param {String} email The email address where the message should be sent.
 */
export async function sendAccountReminder (email) {
    /* —— ⦿ —— ⦿ —— ⦿ —— { RENDER TEMPLATE (HANDLEBARS) } —— ⦿ —— ⦿ —— ⦿ —— */
    const htmlContent = renderEmailTemplate('verifyEmail', {
        loginUrl: `${clientUrl}/login`,
        supportUrl: `${clientUrl}/support`
    });


    /* —— ⦿ —— ⦿ —— ⦿ —— { DEFINE ADDRESSES AND CONTENTS } —— ⦿ —— ⦿ —— ⦿ —— */
    const deliveryStatus = await transporter.sendMail({
        from: `"Greenhouse Support" <${process.env.MAIL_USER}>`,
        replyTo: process.env.MAIL_REPLY_TO,
        to: email,
        subject: 'Did you forget about your account?',
        text: `We received a request to create a new account for this email address, but... you already have an account!
        
        Please sign in at ${htmlContent.loginUrl} to access your account.
        
        If you did not make this request, feel free to let our support team know at ${htmlContent.supportUrl} and we'll look into it for you. 
        
        Thank you,
        
        Greenhouse Product Team.`,
        html: htmlContent
    });


    /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN DELIVERY DETAILS } —— ⦿ —— ⦿ —— ⦿ —— */
    return deliveryStatus;
};
