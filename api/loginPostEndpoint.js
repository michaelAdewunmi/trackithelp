import jwt from 'jsonwebtoken';
import passport from 'passport';

import db from '../db';

const loginUser = (req, res, next) => {
    passport.authenticate(
        'login',
        (err, user, info) => {

            if(err) {
                console.log(err);
            }

            if(info !== undefined) {
                res.send(info.message)
            } else {
                req.logIn(user, () => {
                    db('users')
                    .select('*')
                    .where('email', '=', user[0].email)
                    .then(user => {
                        const token = jwt.sign({ user: user[0] }, process.env.JWT_SECRET);
                        const cookieConfig = {
                            httpOnly: true,
                            maxAge: 3600000,
                            signed: true,
                        }
                        res.cookie('auth', token, cookieConfig).status(200).send({
                            auth: true,
                            //token: token,
                            message: 'User Found, Authenticated and Logged In',
                            user
                        });
                        //res.cookie('auth', token, cookieConfig).status(200).send({ user });
                        //res.cookie('auth', token, cookieConfig).redirect('/user');
                    }).catch(er => {
                        console.log(er);
                        res.send({'err': 'Sorry! There was a problem! Contact Admin'});
                    });
                })
            }
        }
    )(req, res, next);
}

export default loginUser;
