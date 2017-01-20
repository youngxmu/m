var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("paperRouter");

var paperModel = require('../../models/paperModel.js');
var questionModel = require('../../models/questionModel.js');

var router = express.Router();


router.get('/list', function (req, res, next) {
    res.render('admin/paper/list');
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

router.post('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
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
        paperModel.getPaperById(id, function (err, result) {
            if (!err && result) {
                var paper = result;
                paper.isAdmin = isAdmin;
                paper.update_time = commonUtils.formatDate(new Date(paper.update_time));
                paper.file_name = config.imgHost + '/uploads/' + paper.file_name;
                paper.menuList = menuUtils.getMenuPathList(paper.menu_id);
                paper.file_type = commonUtils.getFileTypeName(paper.file_name);
                res.render('admin/paper/detail', paper);
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
        paperModel.insertPaper(name, description, qids, function (err, data) {
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
        paperModel.updatePaper(id, name, description, qids, function (err, result) {
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
        paperModel.delPaper(id, function (err, result) {
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



module.exports = router;

