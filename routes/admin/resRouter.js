var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var sysUtils = require("../../lib/sysUtils.js");
var articleModel = require('../../models/articleModel.js');
var infoModel = require('../../models/infoModel.js');
var paperModel = require('../../models/paperModel.js');
var newsModel = require('../../models/newsModel.js');
var indexModel = require('../../models/indexModel.js');
var menuModel = require('../../models/menuModel.js');
var resourceModel = require('../../models/resourceModel.js');
var messageModel = require('../../models/messageModel.js');
var router = express.Router();


var renderData = {
    title : '数字资源',
    link : 'index/res/list',
};

var dict = {
    1 : '国防历史',
    2 : '国防法规',
    3 : '外国军事',
    4 : '武器装备',
    5 : '国防形势',
    6 : '英模人物'
}
router.get('/list', function (req, res, next) {
    // var moduleId = req.params.moduleId;
    res.render('index/res-list');
});

router.get('/list/:moduleId', function (req, res, next) {
    var moduleId = req.params.moduleId;
    var title = dict[moduleId];
    var data = renderData;
    data.mid = moduleId;
    data.subtitle = title;
    res.render('index/res-list', data);
});

router.post('/up', function (req, res, next) {
    var moduleId = req.body.mid;
    indexModel.getUp(moduleId, function (err, result) {
        if (err || !result || result.length == 0) {
            logger.error("查找文章出错", err);
            res.json({
                success: false,
                msg: "查找文章出错"
            });
        } else {
            var ids = result[0].aids;
            console.log(ids);
            if(!ids || ids == ''){
                return res.json({
                    success: true,
                    msg: "查找文章成功",
                    data: {
                        list: []
                    }
                });
            }
            indexModel.queryUpByIds(ids, function (err, result) {
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
                            list: result
                        }
                    });
                }
            });
        }
    });
});

router.post('/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var moduleId = req.body.moduleId;
    var moduleMap = sysUtils.getModuleMap();
    var title = moduleMap[moduleId];
    var module = moduleMap[moduleId];
    
    // console.log(moduleMap);
    // console.log(title);

    var type = req.body.type;
    if(!type || type == 'undefined'){
        type = '';
    }
    if(!title || title == 'undefined'){
        title = '';
    }

    resourceModel.queryResourceByModuleTotalCount(module, type, function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        resourceModel.queryResourceByModule(module, type, start, pageSize, function (err, result) {
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



router.post('/indexlist', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var moduleId = req.body.moduleId;
    var moduleMap = sysUtils.getModuleMap();
    var module = moduleMap[moduleId];
    var type = req.body.type;
    if(!type || type == 'undefined'){
        type = '';
    }
    indexModel.getUp(module.id, function (err, result) {
        if (err || !result || result.length == 0) {
            logger.error("查找文章出错", err);
            res.json({
                success: false,
                msg: "查找文章出错"
            });
        } else {
            var ids = result[0].aids;
            if(!ids || ids == ''){
                return res.json({
                    success: true,
                    msg: "查找文章成功",
                    data: {
                        list: []
                    }
                });
            }

            var list = [];
            indexModel.queryUpByIds(ids, function (err, result) {
                if (err || !result || !commonUtils.isArray(result)) {
                    logger.error("查找文章出错", err);
                } else {
                    for (var i in result) {
                        var date = new Date(result[i].create_time);
                        result[i].create_time = commonUtils.formatDate(date);
                    }
                    list = result;
                }

                resourceModel.queryResourceByModuleTotalCount(module, type, function (totalCount) {
                    var totalPage = 0;
                    if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
                    else totalPage = totalCount / pageSize + 1;
                    totalPage = parseInt(totalPage, 10);
                    var start = pageSize * (pageNo - 1);
                    resourceModel.queryResourceByModule(module, type, start, pageSize, function (err, result) {
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
                                list.push(result[i]);
                            }
                            if(list.length > 7){
                                list = list.slice(0,7);
                            }
                            res.json({
                                success: true,
                                msg: "查找文章成功",
                                data: {
                                    list: list
                                }
                            });
                        }
                    });
                });
            });
        }
    });
});


   


router.post('/short', function (req, res, next) {
    var moduleId = req.body.moduleId;
    var moduleMap = sysUtils.getModuleMap();
    var title = moduleMap[moduleId];

    var type = req.body.type;
    if(!type || type == 'undefined'){
        type = '';
    }
    if(!title || title == 'undefined'){
        title = '';
    }

    var pageNo = 1;
    var pageSize = 7;
    resourceModel.queryResourceByTitleTotalCount(title, type, function (totalCount) {
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

module.exports = router;