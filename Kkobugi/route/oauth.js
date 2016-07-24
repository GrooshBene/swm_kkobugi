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

    passport.serializeUser(function(user, done){
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new FacebookTokenStrategy({
        clientID : "1769771896571024",
        clientSecret : "79667d4f1b1f030bab3bebaddaae6438",
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
            _id : randomString.generate(13),
            name : req.param('name'),
            phone : req.param('phone'),
            passwd : req.param('passwd'),
            api_token : randomString.generate(15)
        });
        user.save(function (err) {
            if(err){
                console.log("/auth/register Failed");
                throw err;
            }
            else{
                console.log("user register : " + user);
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
            console.log("User "+result+"Logged In");
            res.send(200, result);
        })
    });

    app.post('/auth/destroy', function (req, res) {
        User.findOne({_id : req.param('id')}, function (err, result) {
            if(err){
                console.log("/auth/destroy Failed");
                throw err;
            }
            console.log("Destroy User : " +req.param('id'));
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
            console.log("DB Founded : "+ result);
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

    app.post('/friend/facebook/find', function (req, res) {

    })


    app.post('/friend/local/find', function (req, res) {
        User.find({phone : req.param('phone')}, function (err, result) {
            if(err){
                console.log("friend/local/find err");
                throw err;
            }
            console.log("Local Found : "+result);
            res.send(200, result);
        })
    });

    app.post('/friend/add', function (req, res) {
        var friendArr=[];
        User.findOne({_id: req.param('userId')}, function (err, result) {
            if (err) {
                console.log("/friend/add Error");
                throw err;
            }
            console.log("Founded : "+result);
            friendArr = result.friends;
            console.log("Result's friends array : "+friendArr);
            friendArr.push(req.param('id'));
            User.update({_id: req.param('userId')}, {friends: friendArr}, function (err, result) {
                if (err) {
                    console.log("/friend/add Update Error");
                    throw err;
                }
                else {
                    console.log("FriendAdded : "+friendArr);
                    console.log("Friend Updated : "+ friendArr);
                    res.send(200, result);
                }
            });

        });
    });

    

    //function end
}