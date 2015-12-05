/**
 * Created by roychuchun on 01/12/15.
 */

var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var person_full_name = "";


router.get('/', function(req, res, next) {
    person_full_name= req.query.username;
    console.log(person_full_name)
    var oldEmail = req.query.email;
    var newEmail = person_full_name + '@kfar-yedidim.com';
    res.render('confirm', { title: 'Express', oldEmail:oldEmail, newEmail: newEmail, failed: false, success: false });
});

router.post('/', function(req,res, next) {
    var connection = mysql.createConnection({
            host: process.env.sqlhost,
            port: process.env.sqlport,
            user: process.env.sqlusername,
            password: process.env.sqlpassword,
            database: process.env.dbname
        }
    );

    var password = req.body.password;
    var oldEmail = req.body.oldEmail;
    var newEmail = req.body.newEmail;
    if (password == process.env.shiraz_password) {
        // TODO: INSERT OLDEMAIL=NEWEMAIL INTO TABLE.
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










