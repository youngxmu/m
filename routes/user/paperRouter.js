var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var redisUtils = require("../../lib/redisUtils.js");
var logger = require("../../lib/log.js").logger("paperRouter");

var paperModel = require('../../models/paperModel.js');
var questionModel = require('../../models/questionModel.js');

var router = express.Router();

router.get('', function (req, res, next) {
    res.render('user/paper/index');
});

router.get('/index', function (req, res, next) {
    res.render('user/paper/index');
});

router.get('/list', function (req, res, next) {
    res.render('user/paper/list');
});

router.get('/examlist', function (req, res, next) {
    res.render('user/paper/examlist');
});


router.get('/detail', function (req, res, next) {
    var date = commonUtils.formatNumDate(new Date());
    var name = '练习' + date;
    var description = '练习' + date;
    
    questionModel.queryRandQuestions(4, 0, 24, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("查找题目出错", err);
            res.render('error', {msg: '出错啦'});
        } else {
            var  list = [];
            list = result;
            questionModel.queryRandQuestions(2, 0, 36, function (err, result2) {
                if (err || !result || !commonUtils.isArray(result2)) {
                    logger.error("查找题目出错", err);
                    res.render('error', {msg: '出错啦'});
                } else {
                    for(var index in result2){
                        list.push(result2[index]);
                    }
                    var qidArr = [];
                    for(var key in list){
                        qidArr.push(list[key].id);
                    }

                    var qids = qidArr.join(',');//明文
                   
                    paperModel.insertPaper(name, description, qids, function (err, result) {
                        if (!err) {
                            res.redirect(config.redirectPath + 'paper/detail/' + result.insertId);
                        } else {
                            res.render('error', {msg: '出错啦'});
                        }
                    });
                }
            });
        }
    });
});


//根据试卷id查询
router.get('/detail/:id', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect(config.redirectPath + 'paper/list');
    }
    var id = req.params.id;
    var isAdmin = req.session.user ? true : false;
    var rid = 'test' +'_'+ req.session.user.id + '_' + id;
    var startTime = new Date().getTime();
    var currTime = new Date().getTime();
    var time = 45 * 60 * 1000;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询试卷出错"
        });
    }else{
        paperModel.getPaperById(id, function (err, result) {
            if (!err && result) {
                var paper = result;
                redisUtils.get(rid, function(err,reply){
                    if(err){
                        res.render('error',{
                            success: false,
                            msg: "根据id查询试卷出错"
                        });
                    }else{
                        if(reply){
                            startTime = reply;
                            var offset = time - (currTime - startTime);
                            
                            if(time < 0){
                                return res.render('msg',{
                                    success: false,
                                    msg: "已经参加过考试啦"
                                });
                            }
                            paper.offset = offset;
                            res.render('user/paper/detail', paper);
                        }else{
                            var offset = time - (currTime - startTime);
                            if(time < 0){
                                return res.render('msg',{
                                    success: false,
                                    msg: "已经参加过考试啦"
                                });
                            }
                            redisUtils.set(rid, startTime, function(){
                                paper.offset = offset;
                                res.render('user/paper/detail', paper);                
                            });
                        }
                    }
                });
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询试卷出错"
                });
            }
        });
    }
});


router.get('/exam/:id', function (req, res, next) {
    var id = req.params.id;
    var startTime = new Date().getTime();
    var rid = 'exam' +'_'+ req.session.user.id + '_' + id;
    redisUtils.get(rid, function(err,reply){
        if(err){
            res.render('error',{
                success: false,
                msg: "根据id查询试卷出错"
            });
        }else{
            if(reply){
                startTime = reply;
                var currTime = new Date().getTime();
                var time = 45 * 60 * 1000;
                var offset = time - (currTime - startTime);
                
                if(time < 0){
                    return res.render('msg',{
                        success: false,
                        msg: "已经参加过考试啦"
                    });
                }
                
                console.log(offset);
                req.session.user.startTime = startTime;
                req.session.user.examid = id;
                paperModel.getPaperById(id, function (err, result) {
                    if (!err && result) {
                        var paper = result;
                        questionModel.queryQuestionsByIds(paper.qids, function(err, result){
                            if(err){
                                res.render('error',{
                                    success: false,
                                    msg: "根据id查询试卷出错"
                                });
                            }else{
                                paper.questions = result;
                                paper.offset = offset;
                                res.render('user/paper/exam',paper);
                            }
                        });
                    } else {
                        res.render('error',{
                            success: false,
                            msg: "根据id查询试卷出错"
                        });
                    }
                });
            }else{
                var currTime = new Date().getTime();
                var time = 45 * 60 * 1000;
                var offset = time - (currTime - startTime);
                
                if(time < 0){
                    return res.render('msg',{
                        success: false,
                        msg: "已经参加过考试啦"
                    });
                }
                console.log(offset);
                redisUtils.set(rid, startTime, function(){
                    req.session.user.startTime = startTime;
                    req.session.user.examid = id;
                    paperModel.getPaperById(id, function (err, result) {
                        if (!err && result) {
                            var paper = result;
                            questionModel.queryQuestionsByIds(paper.qids, function(err, result){
                                if(err){
                                    res.render('error',{
                                        success: false,
                                        msg: "根据id查询试卷出错"
                                    });
                                }else{
                                    paper.questions = result;
                                    paper.offset = offset;
                                    res.render('user/paper/exam',paper);
                                }
                            });
                        } else {
                            res.render('error',{
                                success: false,
                                msg: "根据id查询试卷出错"
                            });
                        }
                    });
                });
            }
        }

    });
});

router.get('/history/list', function (req, res, next) {
    res.render('user/paper/history-list');
});

//根据试卷id查询
router.get('/history/detail/:id', function (req, res, next) {
    var id = req.params.id;
    paperModel.getPaperHistoryById(id, function (err, result) {
        if (!err && result) {
            var paper = result;
            res.render('user/paper/history-detail', paper);
        } else {
            res.render('error', {
                success: false,
                msg: "根据id查询试卷出错"
            });
        }
    });
});


//根据”创建渠道“和”是否虚拟“查询试卷
router.post('/list', function (req, res, next) {
    var name = req.body.name;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    paperModel.queryPaperTotalCount(name, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        paperModel.queryPapers(name, start, pageSize, function (err, result) {
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

//根据”创建渠道“和”是否虚拟“查询试卷
router.post('/examlist', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    paperModel.queryExamTotalCount(function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        paperModel.queryExams(start, pageSize, function (err, result) {
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
    var isAdmin = req.session.user ? true : false;
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "根据id查询试卷出错"
        });
    }else{
        paperModel.getPaperById(id, function (err, result) {
            if (!err && result) {
                var paper = result;
                questionModel.queryQuestionsByIds(paper.qids, function(err, result){
                    if(err){
                        res.json({
                            success: false,
                            msg: "根据id查询试卷出错"
                        });
                    }else{
                        paper.questions = result;
                        res.json({
                            success: true,
                            paper : paper
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


//创建试卷
router.post('/commit', function (req, res) {
    var pid = req.body.id;
    var answer = req.body.answer;
    var user = req.session.user;
    console.log(user);
    var uid = user.id;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    
    if(pid == null || pid == undefined){
        res.json({
            success: false,
            msg: "答题失败"
        });
    }else{
        if(req.session && req.session.user && req.session.user.examid){
            var examid = req.session.user.examid;
            var startTime = req.session.user.startTime;
            var currTime = new Date().getTime();
            var offset = currTime - startTime;
            var time = 45 * 60 * 1000;
            if(examid == pid && offset > time){
                return res.json({
                    success: false,
                    msg: "考试已结束"
                });
            }
        }
        paperModel.insertPaperHistory(uid, pid, answer, function (err, data) {
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





//根据”创建渠道“和”是否虚拟“查询试卷
router.post('/history/list', function (req, res, next) {
    var user = req.session.user;
    var uid = user.id;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }

    var title = parseInt(req.body.keyword);
    if(!title || title == 'undefined'){
        title = '';
    }
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);



    paperModel.queryPaperHistoryTotalCount(uid, function (totalCount) {
        logger.info("试卷总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找试卷:", start, pageSize);
        paperModel.queryPaperHistorys(uid, start, pageSize, function (err, result) {
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

router.post('/history/detail/:id', function (req, res, next) {
     var id = req.params.id;
      paperModel.getPaperHistoryById(id, function (err, result) {
          if (!err && result) {
              var history = result;
              paperModel.getPaperById(history.pid, function (err, result) {
                if (!err && result) {
                    var paper = result;
                    questionModel.queryQuestionsByIds(paper.qids, function(err, result){
                        if(err){
                            res.json({
                                success: false,
                                msg: "根据id查询试卷出错"
                            });
                        }else{
                            paper.questions = result;
                            console.log(history);
                            var uAnswerArr = history.answer.split(',');

                            for(var index in paper.questions){
                              paper.questions[index].uanswer = uAnswerArr[index];
                            }
                            res.json({
                                success: true,
                                paper : paper
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

          } else {
              res.json({
                  success: false,
                  msg: "根据id查询试卷出错"
              });
          }
      });
});





module.exports = router;

