var express = require('express');
var router = express.Router();
var mysql = require('mysql');


/* GET users listing. */
router.get('/', function(req, res, next) {
    if(!req.session.userName) {
        res.redirect('/');
        return;
    }
    var connection = mysql.createConnection({
          host: process.env.sqlhost,
          port: process.env.sqlport,
          user: process.env.sqlusername,
          password: process.env.sqlpassword,
          database: process.env.dbname
        }
    );
    var queryString = 'SELECT * FROM ' + process.env.dbname + '.' + process.env.tablename;
    connection.query(queryString, function(err, rows) {
      if(!err) {
          var userTable = '<thead>' +
              '<tr><td style="font-weight:bold; font-size:23px">First name</td>' +
              '<td style="font-weight:bold; font-size:23px">Last Name</td>' +
              '<td style="font-weight:bold; font-size:23px">Email</td></tr>' +
              '</thead>';
          for (var i = 0; i < rows.length; i++) {
              userTable += '<tr>';

              userTable += '<td>' + rows[i].Fname + '</td>';
              userTable += '<td>' + rows[i].Lname + '</td>';
              userTable += '<td>' + rows[i].FakeEmail + '</td>';

              userTable += '</tr>';
          }
      }
      res.render('users', { title: 'express', userTable: userTable });
    });

  //}
});

module.exports = router;
