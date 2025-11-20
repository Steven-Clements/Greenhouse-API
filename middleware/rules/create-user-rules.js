/** ——————>> Copyright © 2025 Clementine Technology Solutions LLC.  <<——————— *\
|* create-user-rules.js | {√}/middleware/rules                                *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* Defines validation rules for the `createUser` endpoint.                    *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version 1.0.0   |  @since: 1.0.0                                          *|
|* @author Steven "Chris" Clements <clements.steven07@outlook.com>            *|
\* ————————————————————————>> All Rights Reserved. <<———————————————————————— */

/* —————————————————————————————————————————————————————————————————————————— *\
| Runtime dependencies                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import { body } from 'express-validator';


/* —————————————————————————————————————————————————————————————————————————— *\
| Create user rules                                                            |
\* —————————————————————————————————————————————————————————————————————————— */
const createUserRules = [
    body('name')
    .exists()
    .withMessage(`The 'name' parameter is required.`)
    .notEmpty()
    .withMessage(`The 'name' field is required.`)
    .isLength({ min: 5, max: 50 })
    .withMessage(`The 'name' field must be between 5 and 50 characters.`)
    .matches(/^[A-Za-z]+([ '-][A-Za-z]+)*$/)
    .withMessage(
      `The name field can only contain letters, dashes (-), spaces, and apostrophes (').`
    ),
  body('username')
    .optional()
    .isLength({ min: 2, max: 25 })
    .withMessage(`The 'username' parameter must be between 2 and 25 characters.`)
    .matches(/^[A-Za-z][A-Za-z0-9_-]{1,24}$/)
    .withMessage(
      `The 'username' parameter can only contain letters, dashes (-), numbers, and underscores (_).`
    ),
  body('email')
    .exists()
    .withMessage(`The 'email' parameter is required.`)
    .notEmpty()
    .withMessage(`The 'email' parameter is required.`)
    .isEmail()
    .withMessage(`The 'email' parameter must be a valid email address.`)
    .isLength({ min: 8, max: 254 })
    .withMessage(`The 'email' parameter must be between 8 and 254 characters.`),
  body('password')
    .exists()
    .withMessage(`The 'password' parameter is required.`)
    .notEmpty()
    .withMessage(`The 'password' parameter is required.`)
    .isLength({ min: 8, max: 64 })
    .withMessage(`The 'password' parameter must be between 8 and 64 characters.`)
];
