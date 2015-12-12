var express = require('express');
var router = express.Router();
var mysql = require('mysql');


/* GET users listing. */
router.get('/', function(req, res, next) {
  /*if(req.session.firstName === undefined){
    res.redirect('/');
  }*/
  //else{
    var connection = mysql.createConnection({
          host: process.env.sqlhost,
          port: process.env.sqlport,
          user: process.env.sqlusername,
          password: process.env.sqlpassword,
          database: process.env.dbname
        }
    );
    var queryString = 'SELECT * FROM ' + process.env.dbname + '.' + process.env.tablename;
    connection.query(queryString, function(err, rows){
      if(!err){
        var userTable = '<thead><tr><th>שם פרטי</th><th>שם משפחה</th><th>אימייל</th></tr></thead>';
        for(var i = 0;i < rows.rows.length; i++){
          userTable += '<tr>';
          for(var key in rows.rows[i]){
            userTable += '<td>'+ rows.rows[i][key] +'</td>';
          }
          userTable += '</tr>'
        }
      }
    });
    res.render('users', { title: 'express', userTable: userTable });
  //}
});

module.exports = router;
