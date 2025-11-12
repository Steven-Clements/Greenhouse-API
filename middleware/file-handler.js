/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* @file fileHandler.js                                                       *|
|*                                                                            *|
|* Captures file uploads from the request object. Ensures the `uploads`       *|
|* directory exists before saving files.                                      *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
/**
 * @package multer
 * @see https://www.npmjs.com/package/multer
 */
import multer from "multer";

/**
 * @package path
 */
import path from "path";

/**
 * @package fs
 */
import fs from "fs";


/* —————————————————————————————————————————————————————————————————————————— *\
|  FIND OR CREATE DIRECTORY                                                    |
\* —————————————————————————————————————————————————————————————————————————— */
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE STORAGE ENGINE                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (request, file, callback) => {
        const extension = path.extname(file.originalname);
        callback(null, `${file.fieldname}-${Date.now()}${extension}`);
    }
});


/* —————————————————————————————————————————————————————————————————————————— *\
|  INITIALIZE MIDDLEWARE                                                       |
\* —————————————————————————————————————————————————————————————————————————— */
const upload = multer({ storage });

export default upload;
