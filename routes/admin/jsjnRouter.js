var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("jsjnRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var articleModel = require("../../models/articleModel.js");
var jsjnModel = require("../../models/jsjnModel.js");
var indexModel = require("../../models/indexModel");
var router = express.Router();

router.get('/list', function (req, res, next) {
    var keyword = req.query.keyword;
    if(!keyword || keyword == 'undefined'){
        keyword = '';
    }
    res.render('admin/jsjn/list',{
        keyword : keyword
    });
});

router.get('/upload', function (req, res, next) {
    res.render('admin/jsjn/upload');
});

router.get('/detail/:id', function (req, res, next) {
    var id = req.params.id;
    if(id == null || id == undefined){
        res.render('error', {
            success: false,
            msg: "找不到页面啦！"
        });
    }else{
        articleModel.getArticleById(id, function (err, result) {
            if (!err && result) {
                var article = result;
                article.update_time = commonUtils.formatDate(new Date(article.update_time));
                if(article.file_name){article.file_name = config.imgHost + '/uploads/' + article.file_name;}
                article.menuList = menuUtils.getMenuPathList(article.menu_id);
                article.file_type = commonUtils.getFileTypeName(article.file_name);

                var view = 'admin/jsjn/detail';
                if(article.file_type == 'pic'){
                    view = 'admin/jsjn/detail-pic';
                }
                if(article.file_type == 'video'){
                    view = 'admin/jsjn/detail-video';
                }
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


//创建文章
// router.post('/save', function (req, res) {
//     var id = req.body.id;
//     var title = req.body.title;
//     var author = req.body.author;
//     var content = req.body.content;//明文
//     var mid = req.body.mid;//明文
//     var fileName = req.body.fileName;//明文
//     var description = req.body.description;//明文
//     var type = commonUtils.getFileType(fileName);
//     var admin = req.session.admin;
//     if(!admin){
//         return res.json({
//             success: false,
//             msg: "请登录"
//         });
//     }
    
//     if(id == null || id == undefined){
//         jsjnModel.addInfo(title, content, 0, 0, function (err, data) {
//             if (!err && data) {
//                 var res_id = data.insertId;
//                 var sys_type = 'jsjnxx';
//                 content_type = type;
//                 articleModel.insertResource(res_id,sys_type,title,content_type, function(err){
//                     if(err){
//                         return res.json({
//                             success: false,
//                             msg: "创建失败"
//                         });
//                     }
//                     return res.json({
//                         success: true,
//                         msg: "创建成功",
//                         data : data
//                     });
//                 });
//             } else {
//                 res.json({
//                     success: false,
//                     msg: "创建失败"
//                 });
//             }
//         });
//     }else{
//         logger.info("管理员修改文章信息", id);
//         jsjnModel.updateInfo(id, title, content, function (err, result) {
//             if (!err) {
//                 var res_id = id;
//                 var sys_type = 'jsjnxx';
//                 content_type = type;
//                 articleModel.updateResource(res_id,sys_type,title,content_type, function(err){
//                     if(err){
//                         return res.json({
//                             success: false,
//                             msg: "修改文章失败"
//                         });
//                     }
//                     return res.json({
//                         success: true,
//                         msg: "修改文章成功"
//                     });
//                 });
//             } else {
//                 logger.error("修改文章个人信息发生错误", err);
//                 res.json({
//                     success: false,
//                     msg: "修改文章个人信息失败"
//                 });
//             }
//         });
//     }
// });




router.post('/info/view/:mid', function (req, res, next) {
    var mid = req.params.mid;
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



router.post('/save', function(req, res, next) {
    var id = req.body.id;
    var type = req.body.type;
    var title = req.body.title;
    var content = req.body.content;
    var pid = req.body.pid;
    console.log(id + ' ' +title);
    if(id){
        jsjnModel.update(id, title, content, function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    msg: "修改失败"
                });
            } else {
                res.json({
                    success: true,
                    msg: "修改成功"
                });
            }
        });
    }else{
        jsjnModel.insert(type, title, content, pid, function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    msg: "保存失败"
                });
            } else {
                res.json({
                    success: true,
                    msg: "保存成功"
                });
            }
        });
    }
});


router.post('/del', function(req, res, next) {
    var id = req.body.id;
    jsjnModel.del(id, function (err, result) {
        if (err) {
            res.json({
                success: false,
                msg: "删除失败"
            });
        } else {
            res.json({
                success: true,
                msg: "删除成功"
            });
        }
    });
});

module.exports = router;

