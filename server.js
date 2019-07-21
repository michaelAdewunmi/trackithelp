import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';


import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { StaticRouter, matchPath } from 'react-router-dom';
import StyleContext from 'isomorphic-style-loader/StyleContext';

import App from '../shared/containers/App';
import routes from '../shared/routes/routes';

import loginInfoChange from '../shared/containers/Login/reducers/reducers';
import signupInfoChange from '../shared/containers/Signup/reducers/reducers';

//Imports for post routes
import loginUser from './routes/loginUser';
import registerUser from './routes/registerUser';

//Passport configuration
import './config/passport';

//Serverside template
import templateFn  from './template'



const server = express();

server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(session({
    secret: 'trackit-token',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}))
server.use(passport.initialize());
server.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
//server.use(passport.session());

server.use(express.static('dist'));

server.get('*', (req, res, next) => {

    console.log(req.signedCookies);
    async function AuthenticateAndGetUser() {
        if(req.signedCookies.auth) {
            let promise = new Promise((resolve) => {
                passport.authenticate(
                'jwt',
                (err, user, info) => {

                    if(err) {
                        console.log(err);
                    }

                    if(info !== undefined) {
                        resolve({ error: info.message });
                    } else {
                        resolve(user);
                    }
                }
            )(req, res, next);
            })
            return await promise;
        }
    }

    const css = new Set();
    const insertCss = (...styles) => styles.forEach(style => css.add(style._getCss()));

    const activeRoute = routes.find(route => matchPath(req.url, route)) || {}
    if(activeRoute.beAuthorized && !req.signedCookies['auth']) {
        res.status(401).redirect('/login');
        return;
    }
    const promise = activeRoute.beAuthorized ? AuthenticateAndGetUser() : Promise.resolve(null);

    promise.then( user => {
        const store = createStore(combineReducers({ loginInfoChange, signupInfoChange }));
        const context = { user };
        const userData = context !== null && context.user ? context.user[0] : null;
        const markup = renderToString(
            <Provider store={store}>
                <StaticRouter context={context} location={req.url}>
                    <StyleContext.Provider value={{ insertCss }}>
                        <App />
                    </StyleContext.Provider>
                </StaticRouter>
            </Provider>,
        )
        console.log("url", req.url);
        if(context.url) {
            // res.redirect(302, context.url);
            console.log("a redirect");
        }else{
            console.log('normal');
        }
        res.send(templateFn(markup, userData, css));
    }).catch(next);
})

server.post('/api/login', loginUser);
server.post('/api/signup', registerUser);


const port = process.env.port || 3000;
server.listen(port)
