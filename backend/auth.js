import express from 'express';
import mongoose from 'mongoose';
import User from "./models/users";

// import bcrypt from 'bcrypt';
// const saltRounds = 10;

const router = express.Router();

const auth = passport => {
    router.post('/registration', (req, res) => {
        console.log(req.body.username, req.body.password)
        const newUser = new User({
            username: req.body.username,
            password: req.body.password,
        });
        console.log("Just created a new User!")
        newUser.save()
               .then(
                   res.status(201).json({
                       success: 'User created!',
                   })
               );
    });
    router.post('/login', (req, res, next) => {
            passport.authenticate('localStrategy', (error, user) => {
                console.log(user);
                user ?
                    res.status(200).json({
                        success: 'User authenticated!',
                        userDetails: {
                            id: user._id,
                            username: user.username
                        },
                    })
                :
                    res.status(401).json({
                        failure: 'Incorrect credentials',
                    });
            })(req, res, next)
    });

    router.get('/registration', (req, res) => res.send("registration"));

    return router;

};

export default auth;

// export default passport => {
//     router.post('/signup', (req, res) => {
//         bcrypt.hash(req.body.password, saltRounds)
//             .then(hash => {
//                 const newUser = new User({
//                     username: req.body.username,
//                     password: hash
//                 });
//                 return newUser.save()
//             })
//             .then(res.status(201).json({
//                 success: "User created!"
//             }))
//             .catch(err => res.status(500).json({
//                 err
//             }));
//     });
//
//     router.post('/login', passport.authenticate('localStrategy', {
//         successRedirect: '/home',
//         failureRedirect: '/login'
//         })
//     );
//
//     return router;
// }