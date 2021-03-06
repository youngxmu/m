var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("resourceRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var resourceModel = require("../../models/resourceModel.js");
var articleModel = require("../../models/articleModel.js");
var jsjnModel = require("../../models/jsjnModel.js");
var jsllModel = require("../../models/jsllModel.js");
var router = express.Router();

var getViewAndData = function(resource, callback){
    var view = 'error';
    var data = {};
    var id = resource.res_id;
    var type = resource.sys_type;
    var contentType = resource.content_type;

    if(type == 'article'){
        articleModel.getArticleById(id, function (err, article) {
            if(!err){
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'admin/resource/editres';
                if(resource.content_type == 6){
                    view = 'admin/resource/edit';
                }
                data = article;
                data.sys_type = 'article';
            }
            callback(view,data);
        });
    }


    if(type == 'jsjnxx'){
        jsjnModel.queryInfoById(id, function (err, article) {
            if(!err){
                var view = 'admin/resource/edit';
                if(resource.content_type == 2 || resource.content_type == 3){
                    view = 'admin/resource/editres';
                }
                data = article[0];
                data.sys_type = 'jsjnxx';
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
                logger.error(err);
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});

router.post('/del', function (req, res, next) {
    var id = req.body.id;
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "删除失败"
        });
    }else{
        resourceModel.delResource(id, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "删除成功"
                });
            } else {
                logger.error(err);
                res.json({
                    success: false,
                    msg: "删除失败"
                });
            }
        });
    }
});

router.post('/update/indexNo', function(req, res, next) {
    var reslist = req.body.reslist;
    var params = JSON.parse(reslist);
    resourceModel.updateIndexNo(params, function (err, result) {
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
});

router.get('/edit', function(req, res, next) {
    var type = req.query.type;
    var sys_type = 'article';
    res.render('admin/resource/edit', {type : type, sys_type : sys_type});
});


router.get('/upload', function(req, res, next) {
    var type = req.query.type;
    var sys_type = 'article';
    res.render('admin/resource/editres', {type : type, sys_type : sys_type});
});


router.get('/list', function (req, res, next) {
    var type = 'video';
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('admin/resource/list',{
        type : type,
        keyword : keyword
    });
});

// router.get('/list/:type', function (req, res, next) {
//     var type = req.params.type;
//     var keyword = req.query.keyword;
//     if(!keyword || keyword == 'undefined'){
//         keyword = '';
//     }
//     res.render('admin/resource/list',{
//         type : type,
//         keyword : keyword
//     });
// });



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

router.get('/list/video', function (req, res, next) {
    res.render('admin/resource/list', {type:'video'});
});

router.get('/list/pic', function (req, res, next) {
    res.render('admin/resource/list', {type:'pic'});
});

router.get('/list/ppt', function (req, res, next) {
    res.render('admin/resource/list', {type:'ppt'});
});

/** 文件类列表 */
router.get('/list/base', function (req, res, next) {
    res.render('admin/resource/list-base');
});

router.get('/list/res', function (req, res, next) {
    res.render('admin/resource/list-res');
});

module.exports = router;

