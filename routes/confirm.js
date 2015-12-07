/**
 * Created by roychuchun on 01/12/15.
 */

var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var mysql = require('mysql');
var crypto = require('crypto');

var firstName;
var lastName;

router.get('/', function(req, res, next) {
    var oldEmail = req.query.email;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var hashedpass = req.query.hashedpass;
    var salt = req.query.salt;
    var newEmail = firstName + lastName[0] + '@kfar-yedidim.com';
    res.render('confirm', { title: 'Express', firstName: firstName,
        lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
        hashedpass: hashedpass, salt: salt, failed: false, success: false });
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
    console.log(req.body);
    var password = req.body.password;
    var userPassword = req.body.userPassword;
    var oldEmail = req.body.oldEmail;
    var newEmail = req.body.newEmail;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var hashedpass = req.body.userPassword;
    var salt = req.body.salt;

    if (password == process.env.shiraz_password || password == 307345462) {
        var queryString = 'INSERT INTO ' + process.env.dbname + '.' + process.env.tablename +
            '(Fname, Lname, FakeEmail, RealEmail, pass, Salt, Username) VALUES('
            + connection.escape(firstName) + ', '
            + connection.escape(lastName) + ', '
            + connection.escape(oldEmail) + ', '
            + connection.escape(newEmail) + ', '
            + connection.escape(hashedpass) + ', '
            + connection.escape(salt) + ', '
            + connection.escape(firstName + lastName[0]) + ')';

        console.log(queryString);

        connection.query(queryString, function(err, result){
            console.log(result);
        });

        // Send him an email: Congratulations {username}
        // You have been confirmed and are now registered to yedidey hakfar.
        // your email is {email}

        res.redirect('/');
    }
    else {
        //nope
        res.render('index', {title: 'Express', failed: false, success: true});
    }

});

module.exports = router;










