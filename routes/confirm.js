/**
 * Created by roychuchun on 01/12/15.
 */

var express = require('express');
var router = express.Router();
var ejs = require('ejs');
var mysql = require('mysql');
var validator = require("email-validator");
var aws = require('aws-sdk');
var nodemailer = require('nodemailer');


aws.config.region = 'us-west-2';
var ses = new aws.SES();


var firstName;
var lastName;

router.get('/', function(req, res, next) {
    var oldEmail = req.query.email;
    var firstName = req.query.firstName;
    var lastName = req.query.lastName;
    var hashedpass = req.query.hashedpass;
    var salt = req.query.salt;
    firstName = firstName.trim();
    firstName = firstName.replace(/^_+|_+$/g,'');
    lastName = lastName.trim();
    lastName = lastName.replace(/^_+|_+$/g,'');
    if(firstName.indexOf('_') != -1) {
        firstName = firstName.substring(0, firstName.indexOf('_'));
    }
    var newEmail = firstName + lastName[0] + '@kfar-yedidim.com';
    res.render('confirm', { title: 'Express', firstName: firstName,
        lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
        hashedpass: hashedpass, salt: salt, failed: false, success: false, errorMsg: '' , extra: getExtra(req)});
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
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var hashedpass = req.body.userPassword;
    var salt = req.body.salt;

    if(!validator.validate(newEmail)) {
        errorMsg = 'Email is not valid. check that it doesn\'t contain hebrew letters';
        res.render('confirm', { title: 'Express', firstName: firstName,
            lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
            hashedpass: hashedpass, salt: salt, failed: false, success: false, errorMsg: errorMsg, extra: getExtra(req)});
        return;
    }

    var userName = newEmail.substring(0, newEmail.indexOf('@'));

    var sentResponse = false;
    if (password == process.env.shirazpassword) {
        var queryString_checkUsername = 'SELECT * FROM ' + process.env.dbname
            + ' WHERE RealEmail = ' + connection.escape(newEmail);

        connection.query(queryString_checkUsername, function(err, result){
            if(result && result.length) {
                errorMsg = 'Email already taken.';
                res.render('confirm', { title: 'Express', firstName: firstName,
                    lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
                    hashedpass: hashedpass, salt: salt, failed: false, success: false, errorMsg: errorMsg, extra: getExtra(req)});
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
            + connection.escape(newEmail) + ', '
            + connection.escape(oldEmail) + ', '
            + connection.escape(hashedpass) + ', '
            + connection.escape(salt) + ', '
            + connection.escape(userName) + ')';


        connection.query(queryString, function(err, result){
        });

        var params = {
            EmailAddress: oldEmail /* required */
        };
        ses.verifyEmailAddress(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
        });


        // Send him an email: Congratulations {username}
        // You have been confirmed and are now registered to yedidey hakfar.
        // your email is {email}


        var mailOptions = {
            from: 'Registration-Bot<' + process.env.email_username + '>', // sender address
            to: oldEmail, // list of receivers
            subject: 'Congratulations ' + firstName + ' ' + lastName + ', You just joined Yedidey Hakfar!', // Subject line
            text: 'Hello ' + firstName + ' ' + lastName + ', we are very happy to congratulate you for joining Yedidey Hakfar Hayarok!' +
            '\nYour application has been reviewed and accepted. This means you are officially a part of us (If you would like, of course :) )' +
            '\nWe opened an email address for you at ' + newEmail + '.' +
            '\nIn order for you to be able to use it, please open the email you recieved from Amazon Web Services,' +
            '\nAnd open the link attached to verify the email.' +
            '\nOnce you do that, you are ready and set to use your new email.' +
            '\nYou don\'t even have to log into it, just start sending emails to your friends who are also in Kfar Yedidim.' +
            '\nWhen you send an email from this address you are using now (' + oldEmail + ')to a @kfar-yedidim.com address,' +
            '\nit will automatically be seen as if it was sent by "' + newEmail + '".' +
            '\nTo see all the email addresses and names of Yedidey Hakfar, you can log into our website at http://www.kfar-yedidim.com' +
            '\nAnd login with ' + userName + ' as your username, and use the password you inserted when you registered.'
        };

        // create reusable transporter object using SMTP transport
        var transporter = nodemailer.createTransport("SMTP", {
            service: 'Gmail',
            auth: {
                user: process.env.email_username,
                pass: process.env.email_password
            }
        });

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error){
            if(error) {
                return console.log(error);
            }
        });

        res.redirect('/');
    }
    else {
        //nope
        //res.end();
        var errorMsg = 'Invalid admin password';
        res.render('confirm', { title: 'Express', firstName: firstName,
            lastName: lastName, oldEmail: oldEmail, newEmail: newEmail,
            hashedpass: hashedpass, salt: salt, failed: false, success: false, errorMsg: errorMsg, extra: getExtra(req)});
        //res.render('index', {title: 'Express', failed: false, success: true});
        //res.render('confirmResults', {title: 'Express', errorMessage: errorMsg });
    }

});

module.exports = router;






