/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* render-templates.js | {√}/utilities                                        *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Render email message templates as handlebars views for defining the markup *|
|* and styling of common outbound communications.                             *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';


/* —————————————————————————————————————————————————————————————————————————— *\
| Render Templates                                                             |
\* —————————————————————————————————————————————————————————————————————————— */
export default function renderTemplates(templateName, data) {
    const filePath = path.join(process.cwd(), 'views', 'email', `${templateName}.hbs`);
    const source = fs.readFileSync(filePath, 'utf8');
    const template = handlebars.compile(source);

    return template(data);
}
