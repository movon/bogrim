var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var nodemailer = require('nodemailer');


router.get('/', function(req, res, next) {
    res.render('register', { title: 'Express' , extra: getExtra(req)});
});

router.post('/', function(req, res, next) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var about = req.body.about;
    var parent = req.body.parent;
    var kidName = req.body.kidName;
    var boger = req.body.boger;
    var yearFinished = req.body.yearFinished;
    var other = req.body.other;
    var password = req.body.password;

    firstName = firstName.replace(/ /g, '_');
    firstName = firstName.replace(/"/g, '');
    lastName = lastName.replace(/ /g, '_');
    lastName = lastName.replace(/"/g, '');

    var mailOptions = {
        from: 'Registration-Bot<' + process.env.email_username + '>', // sender address
        to: 'Shiraz<kfaryarok.sheli@gmail.com>', // list of receivers
        subject: firstName + ' ' + lastName + ' wants to join Yedidey Hakfar!', // Subject line
        text: 'Hello, a new registrant just signed up to Yedidey Hakfar!' +
        '\nTheir application was: ' +
        '\nFirst name: ' + firstName + // plaintext body
        '\nLast name: ' + lastName +  // plaintext body
        '\nEmail: ' + email  // plaintext body
    };

    if(yearFinished) {
        mailOptions.text += '\nBoger in year: ' + yearFinished;
    }
    if(kidName) {
        mailOptions.text += '\nParent of child named: ' + kidName;
    }
    if(other){
        mailOptions.text += '\nOther';
    }

    //hashing the password
    var salt = crypto.randomBytes(32).toString('hex');
    var saltpassword = password + salt;
    var hashedpassword = crypto.createHash('md5').update(saltpassword).digest('hex');

    mailOptions.text += '\nMore about them: ' + about;
    mailOptions.text += '\nTo confirm him: http://www.kfar-yedidim.com/confirm?' +
        'firstName=' + firstName +
        '&lastName=' + lastName +
        '&email=' + email +
        '&hashedpass=' + hashedpassword +
        '&salt=' + salt;

    console.log("here");
    console.log("Mail text: " + mailOptions.text);


    console.log(process.env.email_password);
    console.log(process.env.email_username);

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: process.env.email_username,
            pass: process.env.email_password
        }
    });

    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    // setup e-mail data with unicode symbols


    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });


    res.render('thanks', { title: 'Express', extra: getExtra(req) });
});

module.exports = router;
