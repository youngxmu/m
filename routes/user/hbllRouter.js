var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("hbllRouter.js");
var commonUtils = require("../../lib/utils.js");
var articleModel = require("../../models/articleModel.js");
var router = express.Router();


router.get('', function (req, res, next) {
    res.render('user/hbll/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/hbll/index');
});


router.get('/list', function (req, res, next) {
    res.render('user/hbll/list');
});

router.post('/detail', function (req, res, next) {
    var id = req.param.id;
    articleModel.getArticleById(id, function (err, result) {
        if (!err && result) {
            var data = result[0];
            res.json({
                success: false,
                data: data
            });
        } else {
            res.json({
                success: false,
                msg: "查询文章出错"
            });
        }
    });
});

module.exports = router;

