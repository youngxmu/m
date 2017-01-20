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

router.get('/list', function (req, res, next) {
    // res.render('index/science-desc');
    res.render('index/msg-list');
});

/**  **/
router.post('/msgs', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    messageModel.queryMessageTotalCount(function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        messageModel.queryMessageList(start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找出错", err);
                res.json({
                    success: false,
                    msg: "查找出错"
                });
            } else {
                for (var i in result) {
                    delete result[i].passwd;
                    delete result[i].im_passwd;
                    result[i].create_time = new Date(result[i].create_time).getTime();
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
});


//根据id查询
router.get('/msg/:id', function (req, res, next) {
    var id = req.params.id;
    messageModel.getMessageById(id, function (err, msg) {
        if (!err) {
            msg.create_time = new Date(msg.create_time).getTime();
            msg.title = '国防教育信息';
            msg.link = 'index';
            res.render('index/msg', msg);
        } else {
            res.render('error');
        }
    })
});

module.exports = router;

