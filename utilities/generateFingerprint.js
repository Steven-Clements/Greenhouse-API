/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* generateFingerprint.js                                                     *|
|*                                                                            *|
|* Creates a unique, predictably hashed device fingerprint to relax           *|
|* authentication requirements from users on trusted devices.                 *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import crypto from 'crypto';


/* —————————————————————————————————————————————————————————————————————————— *\
|  GENERATE FINGERPRINT                                                        |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * Create a device fingerprint to store a user's device information and easily |
|  retrieve it later for comparison. (SHA256)
 * 
 * @param {String} userId The ID of the user storing the device.
 * 
 * @param {String} ipAddress The IP address the current device is operating from.
 * 
 * @param {String} userAgent The device information from the request.
 */
export default function generateFingerprint (userId, ipAddress, userAgent) {
    if (!userId || !ipAddress || !userAgent) {
        return null;
    }

    /* —— ⦿ —— ⦿ —— ⦿ —— { CREATE RAW FINGERPRINT } —— ⦿ —— ⦿ —— ⦿ —— */
    const raw = `${userId}|${ipAddress}|${userAgent}`;

    /* —— ⦿ —— ⦿ —— ⦿ —— { HASH PREDICTABLE FINGERPRINT } —— ⦿ —— ⦿ —— ⦿ —— */
    return crypto.createHash('sha256').update(raw).digest('hex');
}
