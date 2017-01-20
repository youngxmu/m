var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("infoRouter");
var commonUtils = require("../../lib/utils.js");
var infoModel = require("../../models/infoModel.js");
var router = express.Router();



router.post('/save', function(req, res, next) {
    var id = req.body.id;
    var name = req.body.name;
    var content = req.body.content;
    var pid = req.body.pid;
    if(id){
        infoModel.update(id, name, content, function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    msg: "修改失败"
                });
            } else {
                res.json({
                    success: true,
                    msg: "修改成功"
                });
            }
        });
    }else{
        infoModel.insert(name, content, pid, function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    msg: "保存失败"
                });
            } else {
                res.json({
                    success: true,
                    msg: "保存成功"
                });
            }
        });
    }
});


router.post('/del', function(req, res, next) {
    var id = req.body.id;
    infoModel.del(id, function (err, result) {
        if (err) {
            res.json({
                success: false,
                msg: "删除失败"
            });
        } else {
            res.json({
                success: true,
                msg: "删除成功"
            });
        }
    });
});

module.exports = router;

