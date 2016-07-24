/**
 * Created by bene on 2016. 7. 21..
 */

module.exports = init;

function init(app, User, Data) {

    var randomString = require('randomstring');

    app.post('/data/add/today', function (req, res) {
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