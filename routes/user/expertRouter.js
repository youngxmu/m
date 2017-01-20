var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("expertRouter");
var expertModel = require('../../models/expertModel.js');
var router = express.Router();


router.get('', function (req, res, next) {
    res.render('user/expert/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/expert/index');
});

router.get('/list', function (req, res, next) {
    res.render('user/expert/list');
});

router.get('/list/:type', function (req, res, next) {
    var type = req.params.type;
    var key = req.query.key;
    if(!key || key == 'undefined'){
        key = '';
    }
    res.render('user/expert/list',{
        type : type,
        key : key
    });
});


//根据”创建渠道“和”是否虚拟“查询专家
router.post('/list', function (req, res, next) {
    var name = req.body.name;
    if(!name){
        name = '';
    }
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    expertModel.queryExpertTotalCount(name, function (totalCount) {
        logger.info("专家总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找专家:", start, pageSize);
        expertModel.queryExperts(name, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找专家出错", err);
                res.json({
                    success: false,
                    msg: "查找专家出错"
                });
            } else {
                for(var index in result){
                    if(result[index].birthday && result[index].birthday != '0000-00-00'){
                        result[index].birthday =  commonUtils.formatShortDate(result[index].birthday);
                    }
                }
                res.json({
                    success: true,
                    msg: "查找专家成功",
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


//根据专家id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.user ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询专家出错"
        });
    }else{
        expertModel.getExpertById(id, function (err, result) {
            if (!err && result) {
                var expert = result;
                expert.avatar = config.imgHost + '/uploads/' + expert.avatar;
                res.render('user/expert/detail', expert);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询专家出错"
                });
            }
        });
    }
});

//根据专家id查询
router.post('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.user ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "没有登录"
        });
    }else{
        expertModel.getExpertById(id, function (err, result) {
            if (!err && result) {
                var expert = result;
                expert.avatar = config.imgHost + '/uploads/' + expert.avatar;
                res.render('user/expert/detail', expert);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询专家出错"
                });
            }
        });
    }
});

//根据专家id查询
router.post('/result', function (req, res, next) {
    var id = req.body.id;
    var type = req.body.type;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    // var isAdmin = req.session.user ? true : false;
    // if(id == null || id == undefined){
    //     res.render('error', {
    //         success: false,
    //          msg: "没有登录"
    //     });
    // }else{
        expertModel.queryExpertResultTotalCount(id, type, function (totalCount) {
            var totalPage = 0;
            if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
            else totalPage = totalCount / pageSize + 1;
            totalPage = parseInt(totalPage, 10);
            var start = pageSize * (pageNo - 1);
            expertModel.queryExpertResults(id, type, start, pageSize, function (err, result) {
                if (err || !result || !commonUtils.isArray(result)) {
                    logger.error("查找出错", err);
                    res.json({
                        success: false,
                        msg: "查找出错"
                    });
                } else {
                    for(var index in result){
                        result[index].create_time =  commonUtils.formatShortDate(result[index].create_time);
                    }
                    res.json({
                        success: true,
                        msg: "查找成功",
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
    // }
});

//根据”创建渠道“和”是否虚拟“查询专家
router.post('/job', function (req, res, next) {
    var job = req.body.job;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    expertModel.queryExpertJobTotalCount(job, function (totalCount) {
        logger.info("专家总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找专家:", start, pageSize);
        expertModel.queryExpertsJob(job, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找专家出错", err);
                res.json({
                    success: false,
                    msg: "查找专家出错"
                });
            } else {
                for(var index in result){
                    if(result[index].birthday && result[index].birthday != '0000-00-00'){
                        result[index].birthday =  commonUtils.formatShortDate(result[index].birthday);
                    }
                }
                res.json({
                    success: true,
                    msg: "查找专家成功",
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
