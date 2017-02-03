var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var articleModel = require("../../models/articleModel.js");
var indexModel = require("../../models/indexModel.js");

var router = express.Router();


router.get('', function (req, res, next) {
    res.render('user/jsjn/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/jsjn/index');
});

router.get('/sys', function (req, res, next) {
    res.render('user/jsjn/sys');
});

router.get('/list', function (req, res, next) {
    res.render('user/jsjn/list');
});

router.get('/list/:type', function (req, res, next) {
    var type = req.params.type;
    res.render('user/jsjn/list', {type: type});
});

router.get('/res', function (req, res, next) {
    res.render('user/jsjn/res');
});

router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "找不到页面啦！"
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'user/jsjn/detail';
                if(article.file_type == 'pic'){
                    view = 'user/jsjn/detail-pic';
                }
                if(article.file_type == 'video'){
                    view = 'user/jsjn/detail-video';
                }
                res.render(view, article);
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});


router.post('/info/view/:mid', function (req, res, next) {
    var mid = req.params.mid;
    indexModel.queryInfoById(mid, function(err, result){
        if(err || result.length == 0){
            res.json({
                success : false,
                msg : '不存在'
            });
        }else{
            res.json({
                success : true,
                data : result[0]
            });
        }
    });
});


module.exports = router;

