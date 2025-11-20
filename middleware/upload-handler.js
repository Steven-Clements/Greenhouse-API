/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* upload-handler.js | {√}/middleware                                         *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Ensures uploaded files are of the requested file and mime type before      *|
|* processing uploads to the server.                                          *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Import dependencies                                                          |
\* —————————————————————————————————————————————————————————————————————————— */
import { v4 as uuidv4 } from 'uuid';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


/* —————————————————————————————————————————————————————————————————————————— *\
| Find or create directory                                                     |
\* —————————————————————————————————————————————————————————————————————————— */
const uploadDirectory = path.join(process.cwd(), 'assets', 'uploads');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}


/* —————————————————————————————————————————————————————————————————————————— *\
| Storage engine                                                               |
\* —————————————————————————————————————————————————————————————————————————— */
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDirectory);
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const uniqueName = `${uuidv4()}${extension}`;
        callback(null, `${uniqueName}`);
    }
});


/* —————————————————————————————————————————————————————————————————————————— *\
| Initialize and export module                                                 |
\* —————————————————————————————————————————————————————————————————————————— */
const upload = multer({ storage });
export default upload;
