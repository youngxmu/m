var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var jsjnModel = require("../../models/jsjnModel.js");
var jsllModel = require("../../models/jsllModel.js");
var router = express.Router();

router.get('', function (req, res, next) {
    res.render('user/jsll/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/jsll/index');
});

router.get('/list', function (req, res, next) {
    res.render('user/jsll/list');
});

router.get('/list/:type', function (req, res, next) {
    var type = req.params.type;
    res.render('user/jsll/list', {type: type});
});

router.post('/list/:type', function (req, res, next) {
    var type = req.params.type;
    jsllModel.queryInfosByType(type, function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                data: {
                    list : result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        }
    });
});

router.post('/info/list', function (req, res, next) {
    jsjnModel.queryInfos(function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                data: {
                    list : result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        }
    });
});

router.post('/info/list/tplan', function (req, res, next) {
    var type = '教案';
    jsjnModel.queryInfosByType(type, function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                data: {
                    list : result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        }
    });
});

router.post('/info/list/other', function (req, res, next) {
    var type = '其它';
    jsjnModel.queryInfosByType(type, function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                data: {
                    list : result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        }
    });
});

router.get('/info/detail/:id', function (req, res, next) {
    var id = req.params.id;
    jsjnModel.queryInfoById(id, function (err, result) {
        if (err || result.length == 0) {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        } else {
           res.json({
                success: true,
                data: result[0]
            });
        }
    });
});

router.post('/info/plist', function (req, res, next) {
    jsllModel.queryLInfos(function (err, result) {
        if (!err && result) {
            res.json({
                success: true,
                data: {
                    list : result
                }
            });
        } else {
            res.json({
                success: false,
                msg: "找不到页面啦！"
            });
        }
    });
});


module.exports = router;

