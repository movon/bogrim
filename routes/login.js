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
    var salt = crypto.randomBytes(32).toString('hex');
    var queryString = "SELECT Password,salt FROM innodb.Users WHERE Username = "
        + connection.escape(username);
    var accepted = false;
    connection.query(queryString, function(err, result){
        console.log(result);
        if (result) {
            var salt = result[1];
            var saltpassword = password + salt;
            var hashedPassword = crypto.createHash('md5').update(saltpassword).digest('hex');
            accepted = result[0] == hashedPassword;
        }
    });

    //res.writeHead(200,{"Content-Type": "text/plain"});
    if (accepted) {
        res.write('Accepted');
    }
    else {
        res.write('Not-Accepted');
    }

    res.end();
});

module.exports = router;