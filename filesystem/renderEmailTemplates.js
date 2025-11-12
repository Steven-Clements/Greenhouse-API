/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* @file renderEmailTemplate.js                                               *|
|*                                                                            *|
|* Generates templates to adjust the markup and styling for outbound email    *|
|* messages.                                                                  *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';


/* —————————————————————————————————————————————————————————————————————————— *\
|  RENDER TEMPLATE                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
export default function renderEmailTemplate(templateName, data) {
    const filePath = path.join(process.cwd(), 'views', 'emails', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = handlebars.compile(source);

    return template(data);
}
