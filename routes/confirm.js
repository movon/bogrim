/**
 * Created by roychuchun on 01/12/15.
 */

var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var mysql = require('mysql');
var validator = require("email-validator");

var firstName;
var lastName;

router.get('/', function(req, res, next) {
    var oldEmail = req.query.email;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var hashedpass = req.query.hashedpass;
    var salt = req.query.salt;
    if(firstName.indexOf(' ') != -1) {
        firstName = firstName.substring(0, firstName.indexOf(' '));
    }
    var newEmail = firstName + lastName[0] + '@kfar-yedidim.com';
    res.render('confirm', { title: 'Express', firstName: firstName,
        lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
        hashedpass: hashedpass, salt: salt, failed: false, success: false, errorMsg: '' });
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
    var oldEmail = req.body.oldEmail;
    var newEmail = req.body.newEmail;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var hashedpass = req.body.userPassword;
    var salt = req.body.salt;

    if(!validator.validate(newEmail)) {
        errorMsg = 'Email is not valid. check that it doesn\'t contain hebrew letters';
        res.render('confirm', { title: 'Express', firstName: firstName,
            lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
            hashedpass: hashedpass, salt: salt, failed: false, success: false, errorMsg: errorMsg});
        return;
    }


    var sentResponse = false;
    if (password == process.env.shiraz_password) {
        var queryString_checkUsername = 'SELECT * FROM ' + process.env.dbname
            + ' WHERE FakeEmail = ' + connection.escape(newEmail);

        connection.query(queryString, function(err, result){
            if(result.length) {
                errorMsg = 'Email already taken.';
                res.render('confirm', { title: 'Express', firstName: firstName,
                    lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
                    hashedpass: hashedpass, salt: salt, failed: false, success: false, errorMsg: errorMsg});
                sentResponse = true;
            }
        });

        if (sentResponse) {
            return;
        }

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
        //res.end();
        var errorMsg = 'Invalid admin password';
        res.render('confirm', { title: 'Express', firstName: firstName,
            lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
            hashedpass: hashedpass, salt: salt, failed: false, success: false, errorMsg: errorMsg});
        //res.render('index', {title: 'Express', failed: false, success: true});
        //res.render('confirmResults', {title: 'Express', errorMessage: errorMsg });
    }

});

module.exports = router;




function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}





