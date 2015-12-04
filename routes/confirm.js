/**
 * Created by roychuchun on 01/12/15.
 */

var express = require('express');
var router = express.Router();
var fname,lname,email,about,full_name;



router.get('/', function(req, res, next) {
    var connection = mysql.createConnection({
            host: 'aaapn5ty4f35zv.cf7gzy2xliu4.us-west-2.rds.amazonaws.com',
            port: '3306',
            user: 'kfarsqlyedidim',
            password: 'Movkfar25.11yarokon162015!',
            database: 'innodb',
        }
    );

    fname = req.query.fname;
    lname = req.query.lname;
    email = req.query.email;
    about = req.query.about;
    full_name = req.query.full_name;
    res.render('confirm', { title: 'Express', person_full_name:full_name, failed: false, success: false });
});

router.post('/', function(req,res, next){
    var password = req.body.password;
    if (password == "alksgjasklfjaksfdjaskfjaksfjaksfjaksfjasfkaj") {

        var queryString = "SELECT Password,salt FROM innodb.Users WHERE Username = "
            + connection.escape(username);
        connection.query(queryString, function(err, result){
            console.log(result);
        });
        //put the guy in db
        res.render('confirm', {title: 'Express', person_full_name: full_name, failed: false, success: true})
    }
    else {
        //nope
        res.render('confirm', {title: 'Express', person_full_name: full_name, failed: true, success: false})
    }

});

module.exports = router;










