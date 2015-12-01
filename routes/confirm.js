/**
 * Created by roychuchun on 01/12/15.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('confirm', { title: 'Express' });
    var fname = req.query.fname;
    var lname = req.query.lname;
    var email = req.query.email;
    var about = req.query.about;
});

router.post('/', function(req,res, next){

});

module.exports = router;
