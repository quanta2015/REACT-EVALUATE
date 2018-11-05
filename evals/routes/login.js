var express = require('express');
var router = express.Router();
var db = require('../db/mysql');


router.post('/', function(req, res, next) {
  var usr = req.body.usr;
  var pwd = req.body.pwd;
  db.login(req, res, usr, pwd);
});

module.exports = router;
