var express = require('express');
var multer  = require('multer')
var router = express.Router();
var db = require('../db/mysql');


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //设置保存文件的路径
    cb(null, 'uploads/'+ req.body.type)
  },
  filename: function (req, file, cb) {
    //修改上传文件名称
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})
var upload = multer({ storage: storage })


router.post('/', upload.single('file'), function(req, res, next) {
  db.saveUploadFile(req, res);
});


module.exports = router;