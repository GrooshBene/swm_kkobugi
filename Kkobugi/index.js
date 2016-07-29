/**
 * Created by bene on 2016. 7. 21..
 */

var express = require('express');
var mongoose = require('mongoose');
var serveStatic = require('serve-static');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended : true
}));

var server = require('http').Server(app);
var https = require('https');

var schema = mongoose.Schema;
mongoose.connect("mongodb://localhost:27017/kkobugi", function (err) {
    if(err){
        console.log("MongoDB Error!");
        throw err;
    }
});

var userSchema = new schema({
    _id : {
        type : String
    },
    name : {
        type : String
    },
    profile : {
        type : String
    },
    phone : {
        type : String
    },
    friends : {
        type : Array
    },
    api_token : {
        type : String
    },
    passwd : {
        type : String
    },
    average : {
        type : Number,
        default : 0
    }


});

var percentSchema = new schema({
    _id : {
        type : String
    },
    user_id : {
        type : String
    },
    percent : {
        type : Number
    },
    date : {
        type : String
    }
});


var User = mongoose.model('user', userSchema);
var Data = mongoose.model('datas', percentSchema);

server.listen(9000);
console.log("Server Running At Port 9000");

require('./route/oauth')(app, User);

require('./route/data')(app, User, Data);