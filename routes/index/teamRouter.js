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

router.get('/info', function (req, res, next) {
    var data =  {
        link : 'index/desc/info',
        title : '中心简介',
        mid : 100101
    };
    res.render('index/desc');
});

var infoData = {
    desc : {
        link : 'index/info/desc',
        title : '中心简介',
        mid : 100101
    },
    org : {
        link : 'index/info/org',
        title : '研究队伍',
        mid : 100102
    },
    
    manage : {
        link : 'index/info/manage',
        title : '管理机构',
        mid : 1002
    },
    about : {
        link : 'index/info/about',
        title : '关于我们',
        mid : 1005
    },
}




router.get('/info/:msg', function (req, res, next) {
    var msg = req.params.msg;
    var data = infoData[msg];
    if(!data){
        data = {
            title : '',
            link : '',
            subtitle : '',
            sublink : '',
            content : ''
        }
    }
    var mid = data.mid;
    indexModel.queryInfoById(mid, function(err, result){
        if(err || result.length == 0){
            res.render('error', {
                msg : '找不到资源啦'
            });
        }else{
            data.content = result[0].content;
            res.render('index/desc', data);
        }
    });
});

router.post('/info/view/:mid', function (req, res, next) {
    var mid = req.params.mid;
    console.log(mid);
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

router.post('/info/save', function (req, res, next) {
    var mid = req.body.mid;
    var content = req.body.content;
    indexModel.updateInfo(mid, content, function(err){
        if(err){
            res.json({
                success : false,
                msg : '更新失败'
            });
        }else{
            res.json({
                success : true,
                msg : '更新成功'
            });
        }
    });
});
var listData = {
    people : {
        link : 'index/list/people',
        title : '数字资源',
        subtitle : '英模人物',
        mid : 1003
    },
    gdmj : {
        link : 'index/list/gdmj',
        title : '英模人物',
        subtitle : '中国古代名将',
        mid : 100301
    },
    hero : {
        link : 'index/list/hero',
        title : '英模人物',
        subtitle : '近代民族英雄',
        mid : 100302
    },
    ghg : {
        link : 'index/list/ghg',
        title : '英模人物',
        subtitle : '共和国将帅',
        mid : 100303
    },
    xdyx : {
        link : 'index/list/xdyx',
        title : '英模人物',
        subtitle : '现代国防英雄',
        mid : 100304
    },

    history : {
        link : 'index/data/history',
        title : '数字资源',
        subtitle : '国防历史',
        keyword : '历史',
        mid : 100401
    },
    rule : {
        link : 'index/data/rule',
        title : '数字资源',
        subtitle : '国防法规',
        keyword : '法规',
        mid : 100402
    },
    foreign : {
        link : 'index/data/foreign',
        title : '数字资源',
        subtitle : '外国军事',
        keyword : '外国',
        mid : 100403
    },
    weapon : {
        link : 'index/data/weapon',
        title : '数字资源',
        subtitle : '武器装备',
        keyword : '武器 装备',
        mid : 100404
    },
    situation : {
        link : 'index/data/situation',
        title : '数字资源',
        subtitle : '国防形势',
        keyword : '形势',
        mid : 100405
    },
    science : {
        link : 'index/data/science',
        title : '学术成果',
        // subtitle : '学术成果',
        keyword : '学术 成果',
        mid : 100406
    }
};


router.get('/list/:msg', function (req, res, next) {
    var msg = req.params.msg;
    var data = listData[msg];
    if(!data){
        res.render('error', {msg:''});
    }
    res.render('index/list', data);
    
});

router.get('/data/:msg', function (req, res, next) {
    var msg = req.params.msg;
    var data = listData[msg];
    if(!data){
        res.render('error', {msg:''});
    }
    res.render('index/list-data', data);
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/list/up', function (req, res, next) {
    var mid = req.body.mid;
    var map = {
        '1003'   : '英模人物',
        '100401' : '历史',
        '100402' : '法规',
        '100403' : '外国',
        '100404' : '武器 装备',
        '100405' : '形势',
        '100406' : '历史'
    }
    indexModel.getUp(mid, function (err, result) {
        console.log(mid);
        console.log(result);
        if (err || !result || result.length == 0) {
            logger.error("查找文章出错", err);
            res.json({
                success: false,
                msg: "查找文章出错"
            });
        } else {
            var ids = result[0].aid;
            console.log(ids);
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


router.post('/list/res', function (req, res, next) {
    var mid = req.body.mid;
    menuModel.queryMenuById(mid, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("查找文章出错", err);
            res.json({
                success: false,
                msg: "查找文章出错"
            });
        } else {
            var pageNo = parseInt(req.body.pageNo);
            var pageSize = parseInt(req.body.pageSize);
            var type = req.body.type;
            if(!type || type == 'undefined'){
                type = '';
            }
            var title = result[0].keyword;
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
        }
    });
});


router.post('/getkey', function (req, res, next) {
    var mid = req.body.mid;
    var map = {
        '1003'   : '英模人物',
        '100401' : '历史',
        '100402' : '法规',
        '100403' : '外国',
        '100404' : '武器 装备',
        '100405' : '形势',
        '100406' : '历史'
    }
    if(!map[mid]){
        return res.json({
            success: false,
            msg: "查找出错"
        });
    }
    
    menuModel.queryMenuById(mid, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            res.json({
                success: false,
                msg: "设置关键字出错"
            });
        } else {
            res.json({
                success: true,
                keyword: result[0].keyword
            });
        }
    });
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/setkey', function (req, res, next) {
    var mid = req.body.mid;
    var keyword = req.body.keyword;
    var map = {
        '1003'   : '英模人物',
        '100401' : '历史',
        '100402' : '法规',
        '100403' : '外国',
        '100404' : '武器 装备',
        '100405' : '形势',
        '100406' : '历史'
    }
    if(!map[mid]){
        return res.json({
            success: false,
            msg: "查找出错"
        });
    }
    
    menuModel.updateMenuById(mid, keyword, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            res.json({
                success: false,
                msg: "设置关键字出错"
            });
        } else {
            res.json({
                success: true,
                msg: "设置关键字成功"
            });
        }
    });
});

//根据”创建渠道“和”是否虚拟“查询文章




//根据”创建渠道“和”是否虚拟“查询文章
router.post('/res/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
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
    console.log(moduleId+' ' + title);
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

