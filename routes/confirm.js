/**
 * Created by roychuchun on 01/12/15.
 */

var express = require('express');
var router = express.Router();
var ejs = require('ejs');

var firstName;
var lastName;

router.get('/', function(req, res, next) {
    var oldEmail = req.query.email;
    var newEmail = req.query.Fname + req.query.Lname[0] + '@kfar-yedidim.com';
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
    //TODO: HOW TO CREATE A PASSWORD
    var password = req.body.password;
    var oldEmail = req.body.oldEmail;
    var newEmail = req.body.newEmail;
    if (password == process.env.shiraz_password) {
        var queryString = 'INSERT INTO ' + process.env.dbname + '.' + process.env.tablename +
            '(Fname, Lname, FakeEmail, RealEmail, pass, Salt, Username) VALUES(' + firsName+
                ', '+ lastName + ', ' + oldEmail + ', ' + newEmail + ', ' +
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










