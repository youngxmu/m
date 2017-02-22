var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var logger = require("../../lib/log.js").logger("voteRouter");

var voteModel = require('../../models/voteModel.js');
var questionModel = require('../../models/questionModel.js');

var router = express.Router();

router.get('', function (req, res, next) {
    res.render('user/vote/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/vote/index');
});

router.get('/list', function (req, res, next) {
    res.render('user/vote/list');
});


//根据”创建渠道“和”是否虚拟“查询试卷
router.post('/list', function (req, res, next) {
    var name = req.body.name;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    voteModel.queryVoteTotalCount(name, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        voteModel.queryVotes(name, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找试卷出错", err);
                res.json({
                    success: false,
                    msg: "查找试卷出错"
                });
            } else {
                res.json({
                    success: true,
                    msg: "查找试卷成功",
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

router.post('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "根据id查询试卷出错"
        });
    }else{
        voteModel.getVoteById(id, function (err, result) {
            if (!err && result) {
                var vote = result;
                questionModel.queryQuestionsByIds(vote.qids, function(err, result){
                    if(err){
                        res.json({
                            success: false,
                            msg: "根据id查询试卷出错"
                        });
                    }else{
                        vote.questions = result;
                        res.json({
                            success: true,
                            vote : vote
                        });
                    }
                });
            } else {
                 res.json({
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
        });
    }
});

//根据试卷id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询试卷出错"
        });
    }else{
        voteModel.getVoteById(id, function (err, result) {
            if (!err && result) {
                var vote = result;
                vote.isAdmin = isAdmin;
                vote.update_time = commonUtils.formatDate(new Date(vote.update_time));
                vote.file_name = config.imgHost + vote.file_name;
                vote.menuList = menuUtils.getMenuPathList(vote.menu_id);
                vote.file_type = commonUtils.getFileTypeName(vote.file_name);
                res.render('user/vote/detail', vote);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
        });
    }
});

router.post('/commit', function (req, res) {
    var pid = req.body.pid;
    var qid = req.body.id;
    var answer = req.body.answer;
    var rtanswer = req.body.rtanswer;
    var user = req.session.user;
    var uid = '0';
    if(qid == null || qid == undefined){
        res.json({
            success: false,
            msg: "答题失败"
        });
    }else{
        voteModel.insertVoteHistory(pid, uid, qid, answer, rtanswer, function (err, data) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "提交成功",
                    data : data
                });
            } else {
                res.json({
                    success: false,
                    msg: "提交失败"
                });
            }
        });
    }
});


router.post('/history/:id', function (req, res, next) {
    var id = req.params.id;
    voteModel.queryVoteHistoryByPid(id, function (err, historys) {
        if(err){
            logger.error('queryVoteHistoryByPid', err);
            return res.json({
                success: false,
                code : 0,
                msg: "根据id查询试卷出错"
            });
        }
        if (historys.length == 0) {
            return res.json({
                success: false,
                code : 1,
                msg: "当前还没有人参与测评，无统计数据"
            });
        }

        var qidMap = {};
        for(var index in historys){
            qidMap[historys[index].qid] = historys[index].qid;
        }
        var qids = [];
        for(var key in qidMap){
            qids.push(key);
        }
        questionModel.queryQuestionsByIds(qids.join(','), function(err, result){
            if(err){
                return res.json({
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
            var vote = {
                historys : historys,
                questions : result
            }
            res.json({
                success: true,
                vote : vote
            });
        });
    });
});


module.exports = router;

