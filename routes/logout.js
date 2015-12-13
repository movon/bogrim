/**
 * Created by daniel on 15/11/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    req.session.userName = null;
    req.session.firstName = null;
    req.session.lastName = null;
    req.session.fakeEmail = null;
    req.session.realEmail = null;
    res.redirect('/');
});

module.exports = router;