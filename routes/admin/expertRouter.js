var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var logger = require("../../lib/log.js").logger("expertRouter");
var expertModel = require('../../models/expertModel.js');
var articleModel = require('../../models/articleModel.js');
var router = express.Router();


router.get('/list', function (req, res, next) {
    res.render('admin/expert/list');
});


router.post('/list', function (req, res, next) {
    var name = req.body.name;
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
                    if(result[index].birthday  && result[index].birthday != '0000-00-00'){
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

router.post('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.json({
            success: false,
            msg: "根据id查询专家出错"
        });
    }else{
        expertModel.getExpertById(id, function (err, result) {
            if (!err && result) {
                var expert = result;
                res.json({
                    success: true,
                    expert : expert
                });
            } else {
                 res.json({
                    success: false,
                    msg: "根据id查询专家出错"
                });
            }
        });
    }
});

//根据专家id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询专家出错"
        });
    }else{
        expertModel.getExpertById(id, function (err, result) {
            if (!err && result) {
                var expert = result;
                expert.avatarView = config.imgHost + '/uploads/' + expert.avatar;
                res.render('admin/expert/detail', expert);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询专家出错"
                });
            }
        });
    }
});

router.get('/add', function (req, res) {
    var expert = {
        id : '',
        name : '',
        gender : '',
        birthday : '',
        tel : '',
        title : '',
        topic : '',
        job_type : '',
        unit : '',
        address : '',
        avatar : '',
        description : ''
    }
    res.render('admin/expert/edit', expert);
});

//根据专家id查询
router.get('/edit/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "根据id查询专家出错"
        });
    }else{
        expertModel.getExpertById(id, function (err, result) {
            if (!err && result) {
                var expert = result;
                if(expert.birthday && expert.birthday != '0000-00-00'){
                    expert.birthday = commonUtils.formatShortDate(expert.birthday);    
                }
                
                expert.avatarView = config.imgHost + '/uploads/' + expert.avatar;

                res.render('admin/expert/edit', expert);
            } else {
                res.render('error', {
                    success: false,
                    msg: "根据id查询专家出错"
                });
            }
        });
    }
});

//创建专家
router.post('/save', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var gender = req.body.gender;
    var birthday = req.body.birthday;
    var title = req.body.title;    
    var unit = req.body.unit;
    var address = req.body.address;
    var tel = req.body.tel;
    var avatar = req.body.avatar;
    var description = req.body.description;
    var topic = req.body.topic;
    var video = '';
    var poster = '';
    var job_type = req.body.job_type;

    var admin = req.session.admin;
    
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }

    if(!birthday){
        birthday = null;
    }
    
    
    if(id == '' || id == null || id == undefined){
        expertModel.insertExpert(name,gender,birthday,title,unit,address,tel,avatar,description,topic,video,poster,job_type, function (err, data) {
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
        expertModel.updateExpert(id,name,gender,birthday,title,unit,address,tel,avatar,description,topic,video,poster,job_type, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改专家信息成功"
                });
            } else {
                logger.error("修改专家个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改专家个人信息失败"
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
        logger.info("管理员删除专家信息", id);
        expertModel.delExpert(id, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "删除专家信息成功"
                });
            } else {
                logger.error("删除专家发生错误", err);
                res.json({
                    success: false,
                    msg: "删除专家失败"
                });
            }
        });
    }
});

router.get('/result/add/:expert_id', function (req, res) {
    var expert_id = req.params.expert_id;
    var type = req.query.type;
    var view = 'admin/expert/editres';
    var data={};
    data.expert_id = expert_id;
    data.type = type;
    res.render(view,data);
});

router.get('/result/edit/:id', function (req, res) {
    var id = req.params.id;
    var expert_id = req.query.expert_id;
    var type = req.query.type;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "找不到页面啦！"
        });
    }else{
        articleModel.getArticleById(id, function (err, article) {
            if(!err){
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + '/uploads/' + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'admin/expert/editres';
                if(article.type == 6){
                    view = 'admin/expert/edittxt';
                }
                data = article;
                data.expert_id = expert_id;
                data.type = type;
            }
            res.render(view,data);
        });
    }
});

router.post('/result/save', function (req, res) {
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    var id = req.body.id;
    var expert_id = req.body.expert_id;
    var result_type = req.body.type;

    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;//明文
    var mid = req.body.mid;//明文
    var fileName = req.body.fileName;//明文
    var description = req.body.description;//明文
    var type = commonUtils.getFileType(fileName);
    
    if(id == null || id == undefined){
        articleModel.insertArticle(title, author, content, 1, mid, admin.id, fileName, type, description,function (err, data) {
            if (!err) {
                var article_id = data.insertId;
                expertModel.insertExpertResult(expert_id, title, article_id, result_type, type, function(err){
                    if(err){
                        console.log(err);
                        return res.json({
                            success: false,
                            msg: "创建失败"
                        });
                    }
                    return res.json({
                        success: true,
                        msg: "创建成功",
                        data : data
                    });
                });
            } else {
                console.log(err);
                res.json({
                    success: false,
                    msg: "创建失败"
                });
            }
        });
    }else{
        logger.info("管理员修改文章信息", id);
        articleModel.updateArticle(id, title, author, content, 1, mid,  admin.id, fileName, type,description, function (err, result) {
            if (!err) {
                var article_id = id;
                logger.error(expert_id,title,article_id,type);
                expertModel.updateExpertResult(expert_id, title, article_id, type, function(err){
                    if(err){
                        console.log(err);
                        return res.json({
                            success: false,
                            msg: "创建失败"
                        });
                    }
                    return res.json({
                        success: true,
                        msg: "创建成功",
                        data : data
                    });
                });
            } else {
                logger.error("修改文章个人信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改文章个人信息失败"
                });
            }
        });
    }
});

router.post('/result/del', function (req, res) {
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
        logger.info("管理员删除专家信息", id);
        expertModel.delExpertResult(id, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "删除专家信息成功"
                });
            } else {
                logger.error("删除专家发生错误", err);
                res.json({
                    success: false,
                    msg: "删除专家失败"
                });
            }
        });
    }
});

module.exports = router;