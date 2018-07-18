// import serverSockets from './sockets';
const app           = require('express')();
const session       = require('express-session');
const mongoose      = require('mongoose');
const connectMongo  = require('connect-mongo');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser    = require('body-parser');
const logger        = require('morgan');
const MongoStore = connectMongo(session);

const http = require('http').Server(app);
const io = require('socket.io')(http);

import User from './models/users';
import auth from './auth';

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB!")
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
    secret: process.env.SECRET,
    store: new MongoStore({mongooseConnection: mongoose.connection}),
}));

passport.use('localStrategy', new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
        .then((user) => {
            if(user) {
                if (password === user.password) {
                    console.log("Matched user and pass");
                    return done(null, user);
                } else {
                    console.log("Did not match pass");
                    return done(null, false);
                }
            }
            else {
                console.log("Did not match user");
                return done(null, false);
            }
        })
        .catch(error => done(error));
}));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch(error => done(error));
});

app.use(passport.initialize());
app.use(passport.session());
app.use('/', auth(passport));

require('./sockets.js')(io);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

app.get('/', (req, res) => {
    res.send("Hello World")
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
