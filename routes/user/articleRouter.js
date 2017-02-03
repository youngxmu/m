var express = require('express');
var articleModel = require('../../models/articleModel.js');
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var logger = require("../../lib/log.js").logger("userArticleRouter");
var config = require("../../config");
var router = express.Router();


router.get('/list', function(req, res, next) {
    var id = req.params.id;
    res.render('article/list');
});


router.get('/list/:mid', function(req, res, next) {
    var mid = req.params.mid;
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    var submenu = menu.submenu;
    var submenuList = [];
    if(submenu && submenu.length > 0){
        for(var index in submenu){
            var sid = submenu[index];
            var midmenu = menuMap[sid];
            submenuList.push(midmenu);
        }
    }
    res.render('article/list2', {
        mid : mid,
        submenuList : submenuList
    });
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var status = 1;
    articleModel.getArticleTotalCount(status, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.getArticleList(status, start, pageSize, function (err, result) {
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


//根据文章id查询
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "找不到页面啦！"
        });
    }else{
        articleModel.queryArticleById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                console.log(article);
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'user/resource/detail-word';
                if(article.type == 0){
                    view = 'user/resource/detail-ppt';
                }
                if(article.type == 1){
                    view = 'user/resource/detail-word';
                }
                if(article.type == 3){
                    view = 'user/resource/detail-pic';
                }
                if(article.type == 4){
                    view = 'user/resource/detail-video';
                }
                if(article.type == 6){
                    view = 'user/resource/detail-txt';
                }
                // if(article.file_type == 'pic'){
                //     view = 'user/resource/detail-pic';
                // }
                // if(article.file_type == 'video'){
                //     view = 'user/resource/detail-video';
                // }
                res.render(view, article);
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});


//根据文章id查询
router.get('/download/:id', function (req, res, next) {
    var id = req.params.id;
    var isAdmin = req.session.admin ? true : false;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "资源不存在"
        });
    }else{
        articleModel.queryArticleById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                var link = config.imgHost + article.file_name;
                console.log(link);
                res.redirect(link);
            } else {
                res.render('error', {
                    success: false,
                    msg: "资源不存在"
                });
            }
        });
    }
});

//创建文章
router.post('/save', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;//明文
    var mid = req.body.mid;//明文
    var fileName = req.body.fileName;//明文
    var description = req.body.description;//明文
    var type = 2;//resource
    var user = req.session.user;
    if(!user){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    if(id == null || id == undefined){
        articleModel.insertArticle(title, author, content,1,mid,  user.id, fileName, type, description,function (err, data) {
            if (!err) {
                console.log(data);
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
        logger.info("管理员修改文章信息", id);
        articleModel.updateArticle(id, title, author, content, 1, mid,  user.id, fileName, type,description, function (err, result) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "修改文章信息成功"
                });
            } else {
                logger.error("修改文章信息发生错误", err);
                res.json({
                    success: false,
                    msg: "修改文章信息失败"
                });
            }
        });
    }
});

router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    var menuPath = req.query.menuPath;
    var menuList = [];
    if(menuPath != null && menuPath != ''){
        var menuMap = menuUtils.getMenuMap();
        var menuArr = menuPath.split(',');
        var lastIndex = menuArr.length - 1;
        for(var i=lastIndex;i>=0;i--){
            var menu = menuMap[menuArr[i]];
            menuList.push(menu);
        }
    }
    if(id == null || id == undefined){
        res.render('user/article/edit', {
            menuList: menuList
        });
    }else{
        articleModel.queryArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                article.menuList = menuList;
                res.render('user/article/edit', article);
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});


//根据文章姓名模糊查询
router.post('/queryArticleByTitle', function (req, res, next) {
    var title = req.body.keyword;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    if(!title || title == 'undefined'){
        title = '';
    }
    articleModel.queryArticleByTitleTotalCount(title, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.queryArticleByTitle(title, start, pageSize, function (err, result) {
            if (!err) {
                for (var i in result) {
                    var date = new Date(result[i].create_time);
                    result[i].create_time = commonUtils.formatDate(date);
                    var article = result[i];
                    article.update_time = commonUtils.formatDate(new Date(article.update_time));
                    if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                    article.menuList = menuUtils.getMenuPathList(article.menu_id);
                    article.file_type = commonUtils.getFileTypeName(article.file_name);
                }
                res.json({
                    success: true,
                    data: {
                        totalCount: totalCount,
                        totalPage: totalPage,
                        currentPage: pageNo,
                        list: result
                    }
                });
            } else {
                res.json({
                    success: false,
                    msg: "根据标题查询文章出错"
                });
            }
        });
    });
});


//根据文章姓名模糊查询
router.post('/queryArticleByMenu', function (req, res, next) {
    var mid = req.body.mid;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    if(menu){
        var mids = [];
        mids.push(mid);
        for(var index in menu.submenu){
            var subId = menu.submenu[index];
            mids.push(subId);
            smenu = menuMap[subId];
            mids = mids.concat(smenu.submenu);
        }
        mid = mids.join(',');
    }else{
        mid = '';
    }

    
    articleModel.getArticleByMenuTotalCount(mid, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.getArticleByMenu(mid, start, pageSize, function (err, result) {
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
                    var article = result[i];
                    article.update_time = commonUtils.formatDate(new Date(article.update_time));
                    article.org_path = article.file_name;
                    if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                    article.menuList = menuUtils.getMenuPathList(article.menu_id);
                    article.file_type = commonUtils.getFileTypeName(article.file_name);
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