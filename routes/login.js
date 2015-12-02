/**
 * Created by roychuchun on 02/12/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var username = req.query.username;
    var password = req.query.password;
    //stuff with sql
    var accepted = true;//later replace it with result of sql
    res.writeHead(200,{"Content-Type": "text/plain"});
    if (accepted) {
        res.write('Accepted');
    }
    else {
        res.write('Not-Accepted');
    }

    res.end()
});

module.exports = router;