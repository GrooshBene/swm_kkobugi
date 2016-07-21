/**
 * Created by bene on 2016. 7. 21..
 */
module.exports = init;

function init(app, User) {
    var mongoose = require('mongoose');
    var passport = require('passport');
    var randomString = require('randomstring');
    app.use(passport.initialize());
    app.use(passport.session());
    var FacebookTokenStrategy = require('passport-facebook-token');
    var data_base = mongoose.connection;
    mongoose.connect("mongodb://localhost:27017/kkobugi", function (err) {
        if(err){
            console.log('MongoDB Error!');
            throw err;
        }
    });

    var schema = mongoose.Schema;

    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookTokenStrategy({
        clientId : "",
        clientSecret : "",
        profileFields: ['id', 'displayName', 'photos', 'email','gender', 'permissions']
    }, function (accessToken, refreshToken, profile, done) {
        console.log(profile);
        User.findOne({
            'id' : profile.id
        }, function (err, user) {
            if(err){
                return done(err);
            }
            if(!user){
                user = new User({
                    _id: profile.id,
                    name : profile.displayName,
                    profile: profile.photos,
                    gender : profile.gender,
                    friends : [],
                    phone : profile.phone
                });
                user.save(function (err) {
                    if(err) console.log(err);
                    else{
                        done(null, profile);
                    }
                })
            }
            else if(user){
                done(null, profile);
            }
        })
    }));

    app.get('/auth/facebook/token', passport.authenticate('facebook-token', {session: false, scope : ['user_friends', 'manage_pages']}),
        function (req, res) {
            console.log("user token : " + req.param('access_token'));
            if(req.user){
                res.send(200, req.user);
            }
            else if(!req.user){
                res.send(401, req.user);
            }
        });
    
    app.get('/auth/facebook/callback', passport.authenticate('facebook-token', {
        successRedirect : '/',
        failureRedirect : '/'
    }));


    app.post('/auth/register', function (req, res) {
        user = new User({
            name : req.param('name'),
            phone : req.param('phone'),
            passwd : req.paran('passwd'),
            api_token : randomString.generate(15)
        });
        console.log("user register : " + user);
        user.save(function (err) {
            if(err){
                console.log("/auth/register Failed");
                throw err;
            }
            else{
                res.send(200, user);
            }
        });

    });

    app.post('/auth/authenticate', function (req, res) {
        console.log('Auth Key : ' + req.param('token'));
        User.findOne({api_token : req.param('token')}, function(err, result){
            if(err){
                console.log("/auth/authenticate failed");
                throw err;
            }
            res.send(200, result);
        })
    });

    app.post('/auth/destroy', function (req, res) {
        console.log("Destroy User : " +req.param('id'));
        User.findOne({id : req.param('id')}, function (err, result) {
            if(err){
                console.log("/auth/destroy Failed");
                throw err;
            }
            res.send(200, result);
        }).remove();
    });

    app.post('/auth/login', function (req, res) {
        console.log("User Login : " + req.param('phone'));
        User.findOne({phone : req.param('phone')}, function (err, result) {
            if(err){
                console.log("/auth/login failed");
                throw err;
            }
            if(result.passwd == req.param('passwd')){
                console.log("User "+ result.name+ "Logged In");
                res.send(200, result);
            }
            else if(result.passwd != req.param('passwd')){
                console.log("Password Error");
                res.send(401, "Access Denied");
            }
        })
    });

    

    //function end
}