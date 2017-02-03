var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var resourceModel = require("../../models/resourceModel.js");
var articleModel = require("../../models/articleModel.js");
var jsjnModel = require("../../models/jsjnModel.js");
var jsllModel = require("../../models/jsllModel.js");
var infoModel = require("../../models/infoModel.js");
var router = express.Router();

router.get('', function (req, res, next) {
    res.render('user/resource/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/resource/index');
});

router.get('/list', function (req, res, next) {
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('user/resource/search',{
        keyword : keyword
    });
});

router.get('/list/:type', function (req, res, next) {
    var type = req.params.type;
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('user/resource/list',{
        type : type,
        keyword : keyword
    });
});


//根据”创建渠道“和”是否虚拟“查询文章
router.post('/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var type = req.body.type;
    if(!type || type == 'undefined'){
        type = '';
    }
    var title = req.body.keyword;
    if(!title || title == 'undefined'){
        title = '';
    }
    resourceModel.queryResourceByTitleTotalCount(title, type, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        resourceModel.queryResourceByTitle(title, type, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                for (var i in result) {
                    // result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
                    var date = new Date(result[i].create_time);
                    result[i].create_time = commonUtils.formatDate(date);
                }
                res.json({
                    success: true,
                    msg: "查找文章成功",
                    data: {
                        totalCount: totalCount,
                        totalPage: totalPage,
                        currentPage: pageNo,
                        list: result
                    }
                });
            }
        });
    });
});


var getViewAndData = function(resource, callback){
    var view = 'error';
    var data = {};
    var id = resource.res_id;
    var type = resource.sys_type;
    var contentType = resource.content_type;
    console.log(contentType);

    if(type == 'article'){
        articleModel.getArticleById(id, function (err, article) {
            if(!err){
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'user/resource/detail-word';
                if(resource.content_type == 0){
                    view = 'user/resource/detail-ppt';
                }
                if(resource.content_type == 1){
                    view = 'user/resource/detail-word';
                }
                if(resource.content_type == 3){
                    view = 'user/resource/detail-pic';
                }
                if(resource.content_type == 4){
                    view = 'user/resource/detail-video';
                }
                if(resource.content_type == 6){
                    view = 'user/resource/detail-txt';
                }
                // if(article.file_type == 'pic'){
                //     view = 'user/resource/detail-pic';
                // }
                // if(article.file_type == 'video'){
                //     view = 'user/resource/detail-video';
                // }
                data = article;
            }
                console.log(data);

            callback(view,data);
        });
    }


    if(type == 'jsjnxx'){
        jsjnModel.queryInfoById(id, function (err, article) {
            if(!err){
                var view = 'user/resource/detail-txt';
                if(resource.content_type == 2){
                    view = 'user/resource/detail-pic';
                }
                if(resource.content_type == 3){
                    view = 'user/resource/detail-video';
                }
                data = article[0];
            }
            callback(view,data);
        });
    }
};

router.get('/detail/:id', function (req, res, next) {
	var id = req.params.id;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "找不到页面啦！"
        });
    }else{
        resourceModel.getResourceById(id, function (err, result) {
            if (!err && result) {
                var resource = result;
                getViewAndData(resource, function(view, data){

                    res.render(view, data);
                });
            } else {
                console.log(err);
                logger.error(err);
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});



/** base info */
router.get('/info/detail/:id', function (req, res, next) {
    var id = req.params.id;
    infoModel.queryInfoById(id, function (err, result) {
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


router.post('/info/list', function (req, res, next) {
    infoModel.queryInfos(function (err, result) {
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

