var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("questionRouter");

var questionModel = require('../../models/questionModel.js');

var router = express.Router();


router.get('/list', function (req, res, next) {
    res.render('admin/question/list');
});

router.post('/list', function (req, res, next) {
    var qtype = req.body.qtype;
    if(qtype == 0){
        qtype = '';
    }
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    questionModel.queryQuestionTotalCount(qtype, function (totalCount) {
        logger.info("题目总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找题目:", start, pageSize);
        questionModel.queryQuestions(qtype, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找题目出错", err);
                res.json({
                    success: false,
                    msg: "查找题目出错"
                });
            } else {
                res.json({
                    success: true,
                    msg: "查找题目成功",
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

//根据题目id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    questionModel.getQuestionById(id, function (err, result) {
        if (!err && result) {
            var question = result;
            question.isAdmin = isAdmin;
            question.update_time = commonUtils.formatDate(new Date(question.update_time));
            question.file_name = config.imgHost + '/uploads/' + question.file_name;
            question.menuList = menuUtils.getMenuPathList(question.menu_id);
            question.file_type = commonUtils.getFileTypeName(question.file_name);
            res.render('admin/question/detail', question);
        } else {
            res.render('error', {
                success: false,
                msg: "根据id查询题目出错"
            });
        }
    });
});

//根据题目id查询
router.post('/detail/:id', function (req, res, next) {
    
    var id = req.params.id;
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "根据id查询题目出错"
        });
    }else{
        questionModel.getQuestionById(id, function (err, result) {
            if (!err && result) {
                var question = result;
                res.json({
                    success:true,
                    question : question
                });
            } else {
                res.json({
                    success: false,
                    msg: "根据id查询题目出错"
                });
            }
        });
    }
});


//创建题目
router.post('/save', function (req, res) {
    var id = req.body.id;
    var qbody = req.body.qbody;
    var qtype = req.body.qtype;
    var qanswer = req.body.qanswer;//明文
    var rtanswer = req.body.rtanswer;//明文
    var type = 1;//resource
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        questionModel.insertQuestion(qbody, qtype, qanswer, rtanswer, function (err, data) {
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
        logger.info("管理员修改题目信息", id);
        questionModel.updateQuestion(id, qbody, qtype, qanswer, rtanswer, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改题目信息成功"
                });
            } else {
                logger.error("修改题目个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改题目个人信息失败"
                });
            }
        });
    }
});

//删除题目
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
        logger.info("管理员删除题目信息", id);
        questionModel.delQuestion(id, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "删除题目信息成功"
                });
            } else {
                logger.error("删除题目发生错误", err);
                res.json({
                    success: false,
                    msg: "删除题目失败"
                });
            }
        });
    }
});

router.post('/random', function (req, res, next) {
    questionModel.queryRandQuestions(4, 0, 20, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("查找题目出错", err);
            res.json({
                success: false,
                msg: "查找题目出错"
            });
        } else {
            var  list = [];
            list = result;
            questionModel.queryRandQuestions(2, 0, 40, function (err, result2) {
                if (err || !result || !commonUtils.isArray(result2)) {
                    logger.error("查找题目出错", err);
                    res.json({
                        success: false,
                        msg: "查找题目出错"
                    });
                } else {
                    for(var index in result2){
                        list.push(result2[index]);
                    }
                    res.json({
                        success: true,
                        msg: "查找题目成功",
                        data: {
                            list: list
                        }
                    });
                }
            });
        }
    });
});

//测评问题
router.post('/vote/save', function (req, res) {
    var id = req.body.id;
    var qbody = req.body.qbody;
    var qtype = req.body.qtype;
    var qanswer = req.body.qanswer;//明文
    var rtanswer = req.body.rtanswer;//明文
    var type = 2;//resource
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(id == null || id == undefined){
        questionModel.insertVoteQuestion(qbody, qtype, qanswer, rtanswer, function (err, data) {
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
        logger.info("管理员修改题目信息", id);
        questionModel.updateQuestion(id, qbody, qtype, qanswer, rtanswer, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改题目信息成功"
                });
            } else {
                logger.error("修改题目个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改题目个人信息失败"
                });
            }
        });
    }
});



module.exports = router;

