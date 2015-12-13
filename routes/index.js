/**
 * Created by daniel on 15/11/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', extra: getExtra(req)});
});

module.exports = router;