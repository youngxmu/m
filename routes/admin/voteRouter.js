var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("voteRouter");

var voteModel = require('../../models/voteModel.js');
var questionModel = require('../../models/questionModel.js');

var router = express.Router();


router.get('/list', function (req, res, next) {
    res.render('admin/vote/list');
});

router.post('/list', function (req, res, next) {
    var name = req.body.name;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    voteModel.getVoteTotalCount(name, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        voteModel.getVotes(name, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找试卷出错", err);
                res.json({
                    success: false,
                    msg: "查找试卷出错"
                });
            } else {
                for(var index in result){
                    result[index].create_time = commonUtils.formatDate(new Date(result[index].create_time));
                }
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

router.post('/outlist', function (req, res, next) {
    var name = req.body.name;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    voteModel.getOutVoteTotalCount(name, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        voteModel.getOutVotes(name, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找试卷出错", err);
                res.json({
                    success: false,
                    msg: "查找试卷出错"
                });
            } else {
                for(var index in result){
                    result[index].create_time = commonUtils.formatDate(new Date(result[index].create_time));
                }
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
                res.render('admin/vote/detail', vote);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
        });
    }
});

//创建试卷
router.post('/save', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var description = req.body.description;
    var qids = req.body.qids;//明文
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        voteModel.insertVote(name, description, qids, function (err, data) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "创建成功",
                    data : data
                });
            } else {
                res.json({
                    success: false,
                    msg: "创建失败"
                });
            }
        });
    }else{
        logger.info("管理员修改试卷信息", id);
        voteModel.updateVote(id, name, description, qids, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改试卷信息成功"
                });
            } else {
                logger.error("修改试卷个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改试卷个人信息失败"
                });
            }
        });
    }
});

router.post('/del', function (req, res) {
    var id = req.body.id;
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "删除失败"
        });
    }else{
        logger.info("管理员删除试卷信息", id);
        voteModel.delVote(id, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "删除试卷信息成功"
                });
            } else {
                logger.error("删除试卷发生错误", err);
                res.json({
                    success: false,
                    msg: "删除试卷失败"
                });
            }
        });
    }
});


router.post('/status', function (req, res) {
    var id = req.body.id;
    var status = req.body.status;
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "修改失败"
        });
    }else{
        voteModel.updateVoteStatus(id, status, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改测评信息成功"
                });
            } else {
                logger.error("修改测评发生错误", err);
                res.json({
                    success: false,
                    msg: "修改测评失败"
                });
            }
        });
    }
});


        
var xlsx = require('node-xlsx');  
router.post('/import', function (req, res) {
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    var questions = [];
    var fileName = req.body.fileName;
    var path = config.uploadDir +'/'+ fileName;
    var obj = xlsx.parse(path);  
    var data = obj[0].data;
    var length = data.length;
    var name = data[0][0];
    var description = '';
    
    for(var index=1;index<length;index++){
        var info = data[index];
        var question = [];
        question.push(info[0]);
        question.push(2);
        var answerArr = [];
        for(var j=1;j<info.length;j++){
            answerArr.push(info[j]);
        }
        question.push(answerArr.join(','));
        question.push(2);
        question.push(new Date());
        questions.push(question);
    }
    questionModel.insertQuestions(questions, function(err, results){
        if(err){
            logger.error(err);
            return res.json({
                success: false,
                msg: "创建失败"
            });
        }
        var insertId = results.insertId;
        var affectedRows = results.affectedRows;
        var qidArr = [];
        for(var i=0;i<affectedRows;i++){
            qidArr.push(parseInt(insertId) + i);
        }
        var qids = qidArr.join(',');
        voteModel.insertVote(name, description, qids, function (err, data) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "导入成功",
                    data : data
                });
            } else {
                res.json({
                    success: false,
                    msg: "导入失败"
                });
            }
        });
    });
});


module.exports = router;

