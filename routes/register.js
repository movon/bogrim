var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('register', { title: 'Express' });
});

router.post('/', function(req, res, next) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var about = req.body.about;

    var nodemailer = require('nodemailer');


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
    var mailOptions = {
        from: 'Registration-Bot<' + process.env.email_username + '>', // sender address
        to: 'Tal<talbor49@gmail.com>', // list of receivers
        subject: firstName + ' ' + lastName + ' wants to join Yedidey Hakfar!', // Subject line
        text: 'Hello, a new registrant just signed up to Yedidey Hakfar!' +
                '\nTheir application was: ' +
                '\nFirst name: ' + firstName + // plaintext body
                '\nLast name: ' + lastName +  // plaintext body
                '\nEmail: ' + email +    // plaintext body
                '\nMore about them: ' + about      // plaintext body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

    });


    res.render('index', { title: 'Express' });
});

module.exports = router;
