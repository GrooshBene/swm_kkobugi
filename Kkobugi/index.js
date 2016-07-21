/**
 * Created by bene on 2016. 7. 21..
 */

var express = require('express');
var mongoose = require('mongoose');
var serveStatic = require('serve-static');
var app = express();

var server = require('http').Server(app);
var https = require('https');
app.use(bodyParser.urlencoded({
    extended : true
}));

var schema = mongoose.Schema;

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
    }


});

var percentSchema = new Schema({
    id : {
        type : String
    },
    user_id : {
        type : String
    },
    percent : {
        type : Number
    }
});


var User = mongoose.model('user', userSchema);
var Data = mongoose.model('datas', percentSchema);

server.listen(8000);
console.log("Server Running At Port 8000");

require('./route/oauth')(app, User);

require('./route/data')(app, User, Data)