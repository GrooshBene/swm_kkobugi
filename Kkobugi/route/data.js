/**
 * Created by bene on 2016. 7. 21..
 */

module.exports = init;

function init(app, User, Data) {
    var mongoose = require('mongoose');
    mongoose.connect("mongodb://localhost:27017/kkobugi", function (err) {
        if(err){
            console.log("MongoDB Error!");
            throw err;
        }
    });

    app.post('/data/add/today', function (req, res) {
        data = new Data({
            user_id : req.param('user_id'),
            percent: req.param('percent'),
            date : req.param('date')
        });
        data.save(function (err) {
            if(err, result){
                console.log("Percent Data Saving error!");
                throw err;
            }
            else{
                console.log("Data Saved : "+ result);
                res.send(200, result);
            }
        })
    });

    app.post('/data/getdata/array', function (req, res) {
        Data.find({user_id : req.param('id')}, function(err, result){
            if(err){
                console.log("/data/getdata/array error");
                throw err;
            }
            console.log("Data Founded : " + result);
            res.send(200, result);
        })
    });

    app.post('/data/getdata/rank', function(req,res){

    });


    //function end
}