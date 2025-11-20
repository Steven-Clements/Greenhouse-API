/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* deliver-email.js | {√}/utilities                                           *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Define the data and templates to deliver with outbound email messages for  *|
|* email verification, account recovery, account notification, and marketing  *|
|* purposes.                                                                  *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import nodemailer from 'nodemailer';


/* —————————————————————————————————————————————————————————————————————————— *\
| Application modules                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import log from './logger.js';


/* —————————————————————————————————————————————————————————————————————————— *\
| Helper variables                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
const basePath = process.env.RENDER_EXTERNAL_URL || process.env.BASE_PATH || 'http://localhost';
const port = Number.parseInt(process.env.PORT, 10) || 5000;
const versionPath = process.env.VERSION_PATH || '/api/v1';
const clientUrl = process.env.CLIENT_URL;


/* —————————————————————————————————————————————————————————————————————————— *\
| Create transport                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
export function createTransporter() {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number.parseInt(process.env.MAIL_PORT, 10),
            secure: Number.parseInt(process.env.PORT, 10) === 465,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        return transporter;
    } catch (error) {
        log('error', 'Failed to create SMTP transporter.', { cause: error })
    }
}


/* —————————————————————————————————————————————————————————————————————————— *\
| Send email verification                                                      |
\* —————————————————————————————————————————————————————————————————————————— */
export async function sendEmailVerification(email, userId, verificationCode) {
    /* —— ⦿ —— ⦿ —— ⦿ —— { RENDER TEMPLATE (HANDLEBARS) } —— ⦿ —— ⦿ —— ⦿ —— */
    const link = `${basePath}:${port}${versionPath}/auth/verify-email?userId=${userId}&verificationCode=${verificationCode}`;
    const supportUrl = `${clientUrl}/support`
    const htmlContent = renderEmailTemplate('verifyEmail', {
        link,
        supportUrl
    });


    
    /* —— ⦿ —— ⦿ —— ⦿ —— { DEFINE ADDRESSES AND CONTENTS } —— ⦿ —— ⦿ —— ⦿ —— */
    const deliveryStatus = await transporter.sendMail({
        from: `"Greenhouse Support" <${process.env.MAIL_USER}>`,
        to: email,
        replyTo: process.env.MAIL_REPLY_TO,
        subject: '✔ Verify your email address',

        text: `Welcome and thank you for your interest in Greenhouse. Click the link below to verify your email address:
        
        ${link}
        
        If you did not make this request, feel free to let our support team know at ${supportUrl} and we'll look into it for you.
        
        Thanks,
        
        Greenhouse Product Team`,
        html: htmlContent
    });


    /* —— ⦿ —— ⦿ —— ⦿ —— { RETURN DELIVERY DETAILS } —— ⦿ —— ⦿ —— ⦿ —— */
    return deliveryStatus;
}
