/**
 * Created by roychuchun on 02/12/15.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');

/* GET home page. */
router.get('/', function(req, res, next) {
    var username = req.query.username;
    var password = req.query.password;
    //stuff with sql

    var connection = mysql.createConnection({
        host: process.env.sqlhost,
        port: process.env.sqlport,
        user: process.env.sqlusername,
        password: process.env.sqlpassword,
        database: process.env.dbname
        }
    );
    //setup password hash
    var queryString = "SELECT * FROM Users WHERE Username = "
        + connection.escape(username);
    var accepted = false;

    connection.query(queryString, function(err, result){
        console.log('result: ' + result);
        if (result && result.length > 0) {
            var salt = result[0].Salt;
            var saltpassword = password + salt;
            var hashedPassword = crypto.createHash('md5').update(saltpassword).digest('hex');
            console.log(saltpassword);
            console.log('hashed:' + hashedPassword);
            accepted = result[0].Pass == hashedPassword;
            if (accepted) {
                res.write('Accepted');
                req.session.userName = username;
                req.session.firstName = result[0].Fname;
                req.session.lastName = result[0].Lname;
                req.session.fakeEmail = result[0].FakeEmail;
                req.session.realEmail = result[0].RealEmail;
            }
            else {
                res.write('Not-Accepted');
            }
        }


        res.end();
    });
    //res.writeHead(200,{"Content-Type": "text/plain"});

});

module.exports = router;