/**
 * Created by bene on 2016. 7. 21..
 */

module.exports = init;

function init(app, User, Data) {

    var randomString = require('randomstring');

    app.post('/data/add/today', function (req, res) {
        var sum = 0;
        var average;
        data = new Data({
            _id : randomString.generate(15),
            user_id : req.param('user_id'),
            percent: req.param('percent'),
            date : req.param('date')
        });
        data.save(function (err, result) {
            if(err){
                console.log("Percent Data Saving error!");
                throw err;
            }
            else{
                console.log("Data Saved : "+ result);
                res.send(200, result);
            }
        });

        Data.find({user_id : req.param('user_id')}, function (err, result) {
            if(err){
                console.log("/data/add/today average update failed");
                throw err;
            }
            console.log("Data Founded : " + result);
            for (var i = 0; i < result.length; i++) {
                sum += result[i].percent;
                console.log("Sum : "+sum);
            }
            average = sum/result.length;
            console.log("Average : "+average);
            User.update({
                _id : req.param('user_id')
            }, {average : average}, function (err, result) {
                if(err){
                    console.log("Data Average Update Failed");
                    throw err;
                }
                console.log("Average Updated : "+ result);
            })
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
        User.find({$query:{},$orderby:{average : 1}}, function (err, result) {
            if(err){
                console.log("/data/getdata/rank error");
                throw err;
            }
            console.log("Data Founded : "+ result);
            res.send(200, result);
        })
    });


    //function end
}