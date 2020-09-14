const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://ivij:Ish%40nvij11@task.c7clx.mongodb.net", {useNewUrlParser:true, useUnifiedTopology: true });
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const app = express();
const port = process.env.PORT || 3000;
const base = `${__dirname}/public`;
const cookie = require('cookie-session');

const User = mongoose.model('User', new mongoose.Schema({
    googleID: String,
    name: String,
    isAdmin: Boolean
}));


app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

passport.use(new GoogleStrategy(
    {
        clientID: "995548779792-ljo0o8ql3mnlentajt2b6j38ma660b0e.apps.googleusercontent.com",
        clientSecret: "4MJ2rZe3oxUpf8A_bLURYxfv",
        callbackURL: "/auth/google/redirect"
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({googleID: profile.id}).then((currentUser)=> {
            if(currentUser){
                done(null,currentUser);
            }else{
                new User({
                    googleID: profile.id,
                    name: profile.name.givenName,
                    isAdmin: false
                }).save().then((newUser)=>{
                    done(null,newUser);
                });
            }
        })
    }
));
app.use(cookie({
    maxAge: 24*60*60*1000,
    keys:['asfdadssafd']
}));


app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
});




app.get('/', (req, res) => {
    res.sendFile(`${base}/Welcome-Page.html`);
});
app.get('/device-list', function (req, res) {
    res.sendFile(`${base}/device-list.html`);
});
app.get('/register-device', (req, res) => {
    res.sendFile(`${base}/register-device.html`);
});
app.get('/send-command', (req, res) => {
    res.sendFile(`${base}/send-command.html`);
});
app.get('/registration', (req, res) => {
    res.sendFile(`${base}/registration.html`);
});

app.get('/login', (req, res) => {
    res.sendFile(`${base}/login.html`);
});

app.get('/menu', (req, res) => {
    res.sendFile(`${base}/menu.html`);
});

app.get('/About-The-Team', (req, res) => {
    res.sendFile(`${base}/About-The-Team.html`);
});

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

app.get('/auth/google/redirect', passport.authenticate('google'),(req,res)=>{
    const user = req.user;
    app.locals.user = user;
    res.redirect('/device-list');
});
app.get('/auth/google/user', (req,res)=>{
    res.send(app.locals.user)
});

app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
