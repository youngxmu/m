var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var logger = require("../../lib/log.js").logger("articleRouter");
var articleModel = require('../../models/articleModel.js');
var router = express.Router();

/** 文件类列表 */
router.get('/list', function (req, res, next) {
    res.render('admin/article/list', {type:'video'});
});

router.get('/list/video', function (req, res, next) {
    res.render('admin/article/list', {type:'video'});
});

router.get('/list/pic', function (req, res, next) {
    res.render('admin/article/list', {type:'pic'});
});

router.get('/list/ppt', function (req, res, next) {
    res.render('admin/article/list', {type:'ppt'});
});

/** 文件类列表 */
router.get('/list/base', function (req, res, next) {
    res.render('admin/article/list-base');
});

router.get('/list/res', function (req, res, next) {
    res.render('admin/article/list-res');
});

/** 导入文字信息列表 */
router.get('/infolist', function (req, res, next) {
    res.render('admin/article/info-list');
});

/** 详细页面 */
router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "找不到页面啦！"
        });
    }else{
        articleModel.getArticleById(id, function (err, article) {
            if(!err){
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'admin/article/editres';
                if(article.type == 6){
                    view = 'admin/article/edit';
                }
                data = article;
                data.sys_type = 'article';
            }
            res.render(view,data);
        });
    }
});

/** 附件页面 */
router.get('/upload', function (req, res, next) {
    var id = req.query.id;
    var menuPath = req.query.menuPath;
    var isAdmin = true;
    if(!req.session.admin){
        isAdmin = false;
    }

    var menuList = [];
    if(menuPath != null && menuPath != ''){
        var menuMap = menuUtils.getMenuMap();
        var menuArr = menuPath.split(',');
        // var lastIndex = menuArr.length - 1;//逆向
        // for(var i=lastIndex;i>=0;i--){
        //     var menu = menuMap[menuArr[i]];
        //     menuList.push(menu);
        // }
        for(var i in menuArr){
            var menu = menuMap[menuArr[i]];
            menuList.push(menu);
        }
    }
    if(id == null || id == undefined){
        res.render('admin/article/upload', {
            menuList: menuList,
            isAdmin : isAdmin
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);
                
                article.menuList = menuList;
                res.render('admin/article/upload', 
                    article
                );
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
    // res.render('admin/article/upload');
});

/** 待审核列表 */
router.get('/uneval', function(req, res, next) {
    // var id = req.params.id;
    res.render('admin/article/uneval');
});

//编辑文章
router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    var menuPath = req.query.menuPath;
    var isAdmin = true;
    if(!req.session.admin){
        isAdmin = false;
    }

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
        res.render('admin/article/edit', {
            menuList: menuList,
            isAdmin : isAdmin
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err) {
                console.log(result);
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);
                
                article.menuList = menuList;
                res.render('admin/article/edit', 
                    article
                );
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});

router.get('/editres/:id', function(req, res, next) {
    var id = req.params.id;
    var menuPath = req.query.menuPath;
    var isAdmin = true;
    if(!req.session.admin){
        isAdmin = false;
    }

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
        res.render('admin/article/editres', {
            menuList: menuList,
            isAdmin : isAdmin
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);
                
                article.menuList = menuList;
                res.render('admin/article/editres', 
                    article
                );
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});

router.get('/edit', function(req, res, next) {
    var id = req.query.id;
    var menuPath = req.query.menuPath;
    var isAdmin = true;
    if(!req.session.admin){
        isAdmin = false;
    }

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
        res.render('admin/article/edit', {
            menuList: menuList,
            isAdmin : isAdmin
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);
                
                article.menuList = menuList;
                res.render('admin/article/edit', 
                    article
                );
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});


router.get('/editres', function(req, res, next) {
    var id = req.query.id;
    var menuPath = req.query.menuPath;
    var isAdmin = true;
    if(!req.session.admin){
        isAdmin = false;
    }

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
        res.render('admin/article/editres', {
            menuList: menuList,
            isAdmin : isAdmin
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err) {
                var article = result;
                article.isAdmin = isAdmin;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);
                
                article.menuList = menuList;
                res.render('admin/article/editres', 
                    article
                );
            } else {
                res.render('error', {
                    success: false,
                    msg: "找不到页面啦！"
                });
            }
        });
    }
});


//基本列表
router.post('/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    articleModel.getArticleTotalCount(status, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.queryModelList(isVirtual, createFrom, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                for (var i in result) {
                    delete result[i].im_passwd;
                    result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
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

//json文章数据
router.post('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    articleModel.queryArticleById(id, function (err, result) {
        if (!err && result) {
            var article = result;
            article.isAdmin = isAdmin;
            article.update_time = commonUtils.formatDate(new Date(article.update_time));
            if(article.file_name){article.file_name = config.imgHost + article.file_name;}
            article.menuList = menuUtils.getMenuPathList(article.menu_id);
            article.file_type = commonUtils.getFileTypeName(article.file_name);
            res.json({
                success: true,
                data : article
            });
        } else {
            res.json({
                success: false,
                data : article
            });
        }
    });
});

//创建文章
router.post('/save', function (req, res) {
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    
    var id = req.body.id;
    var title = req.body.title;
    var author = req.body.author;
    var content = req.body.content;//明文
    var mid = req.body.mid;//明文
    var fileName = req.body.fileName;//明文
    var description = req.body.description;//明文
    var type = commonUtils.getFileType(fileName);
    var admin = req.session.admin;
    if(!admin){
        return res.json({
            success: false,
            msg: "请登录"
        });
    }
    if(id == null || id == undefined || id == ''){
        articleModel.insertArticle(title, author, content, 1, mid, admin.id, fileName, type, description,function (err, data) {
            if (!err && data) {
                var res_id = data.insertId;
                var sys_type = 'article';
                content_type = type;
                articleModel.insertResource(res_id,sys_type,title,content_type, function(err){
                    if(err){
                        logger.error(err);
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
                logger.error(err);
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
                var res_id = id;
                content_type = type;
                articleModel.updateResource(res_id,null,title,content_type, function(err){
                    if(err){
                        return res.json({
                            success: false,
                            msg: "修改文章失败"
                        });
                    }
                    return res.json({
                        success: true,
                        msg: "修改文章成功"
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

//删除文章
router.post('/del', function(req, res, next) {
    var id = req.body.id;
    var menuPath = req.query.menuPath;
    var isAdmin = true;
    if(!req.session.admin){
        isAdmin = false;
    }

    articleModel.delArticle(id, function (err, result) {
        if (!err) {
            res.json({
                success: true
            });
        } else {
           res.json({
                success: false,
                msg: "删除出错"
            });
        }
    });
});

//json待审核文章
router.post('/uneval', function (req, res, next) {
    var mid = req.body.mid;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    var menuMap = menuUtils.getMenuMap();
    var menu = menuMap[mid];
    if(!menu){
        mid = null;
    }else{
        var mids = [];
        mids.push(mid);
        for(var index in menu.submenu){
            var subId = menu.submenu[index];
            mids.push(subId);
            smenu = menuMap[subId];
            mids = mids.concat(smenu.submenu);
        }
        mid = mids.join(',');
    }
    
    var status = 0;
    articleModel.queryArticleTotalCount(status, mid, function (totalCount) {
        logger.info("文章总数:", totalCount);
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);

        logger.info("查找文章:", start, pageSize);
        articleModel.queryArticles(status, mid, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找文章出错", err);
                res.json({
                    success: false,
                    msg: "查找文章出错"
                });
            } else {
                for (var i in result) {
                    result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time));
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

