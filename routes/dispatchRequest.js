/** -------->>Copyright © 2025 Clementine Technology Solutions LLC.<<-------- *\
|* @file static.js                                                            *|
|*                                                                            *|
|* Handles requests to uris beginning with `/`                                *|
|* —————————————————————————————————————————————————————————————————————————— *|
|* @version  1.0.0  |  @since  1.0.0                                          *|
|* @author   Steven "Chris" Clements <clements.steven07@outlook.com>          *|
\* ------------------------->>All rights reserved.<<------------------------- */

/* —————————————————————————————————————————————————————————————————————————— *\
|  IMPORT DEPENDENCIES                                                         |
\* —————————————————————————————————————————————————————————————————————————— */
import path from 'path';
import express from 'express';

import v1Routes from './v1Routes.js';


/* —————————————————————————————————————————————————————————————————————————— *\
|  INITIALIZE EXPRESS ROUTER                                                   |
\* —————————————————————————————————————————————————————————————————————————— */
const router = express.Router();


/* —————————————————————————————————————————————————————————————————————————— *\
|  DEFINE API ROUTES (V1)                                                      |
\* —————————————————————————————————————————————————————————————————————————— */
router.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

router.get('/login', (request, response) => { 
    response.render('login', {
        title: 'Sign In | Greenhouse',
        description: 'Sign in',
        keywords: 'login, sign in, greenhouse, account, user',
        image: '/assets/logo.png',
        imageAlt: 'Greenhouse product logo',
        url: '/login'
    });
});

router.get('/register', (request, response) => { 
    response.render('register', {
        title: 'Sign Up | Greenhouse',
        description: 'Sign up for a new account.',
        keywords: 'register, sign up, greenhouse, account, user',
        image: '/assets/logo.png',
        imageAlt: 'Greenhouse product logo',
        url: '/register'
    });
});

router.get('/notice', (request, response) => { 
    response.render('notice', {
        title: 'Email Verification | Greenhouse',
        description: 'Verify your email address before signing in.',
        keywords: 'verification, email, greenhouse, account, user',
        image: '/assets/logo.png',
        imageAlt: 'Greenhouse product logo',
        url: '/notice'
    });
});

router.get(`${process.env.VERSION_PATH}`, v1Routes);

const dispatchRequest = router;
export default dispatchRequest;
