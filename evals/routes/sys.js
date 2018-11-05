var express = require('express');
var router = express.Router();
var db = require('../db/mysql');

router.get('/getClass', function(req, res, next) {
  db.getClass(req, res);
});

router.post('/saveTask', function(req, res, next) {
  db.saveTask(req, res);
});

router.get('/getTask', function(req, res, next) {
  db.getTask(req, res);
});

router.post('/getDoTask', function(req, res, next) {
  db.getDoTask(req, res);
});

router.post('/saveTaskDetail', function(req, res, next) {
  db.saveTaskDetail(req, res);
});

router.post('/getEvalTask', function(req, res, next) {
  db.getEvalTask(req, res);
});

router.post('/getEvalTaskDetail', function(req, res, next) {
  db.getEvalTaskDetail(req, res);
});

router.post('/saveEvalTaskDetail', function(req, res, next) {
  db.saveEvalTaskDetail(req, res);
});

router.post('/getResult', function(req, res, next) {
  db.getResult(req, res);
});

router.post('/getAnalysisList', function(req, res, next) {
  db.getAnalysisList(req, res);
});

router.post('/getAnalysisDetail', function(req, res, next) {
  db.getAnalysisDetail(req, res);
});



module.exports = router;
