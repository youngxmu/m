var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("teacherRouter");
var commonUtils = require("../../lib/utils.js");

var adminModel = require('../../models/adminModel.js');

var router = express.Router();

router.get('/list', function (req, res, next) {
    if(req.session && req.session.admin && req.session.admin.type == 1){
        res.render('admin/user/tlist');
    }else{
        res.render('error', {msg: '没有权限'});
    }
});

router.post('/list', function (req, res, next) {
    if(!req.session || !req.session.admin || !req.session.admin.type == 1){
        return res.json({
            success: false,
            msg : '没有权限'
        });
    }


    var username = req.body.username;
    var tel = req.body.tel;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);
    adminModel.getTeacherTotalCount(username, tel, function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        adminModel.queryTeacherList(username, tel, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找出错", err);
                res.json({
                    success: false,
                    msg: "查找出错"
                });
            } else {
                for (var i in result) {
                    delete result[i].passwd;
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

router.post('/save', function (req, res) {
    if(!req.session || !req.session.admin || !req.session.admin.type == 1){
        return res.json({
            success: false,
            msg : '没有权限'
        });
    }

    var id = req.body.id;
    var name = req.body.name;
    var password = req.body.password;//明文
    var username = req.body.username;
    var tel = req.body.tel;
    var type = 2;//req.body.type;
    password = commonUtils.md5(password);//加盐生成真实入库密码
    console.log(username);
    if(!id){
        adminModel.insert(name, password, username, tel, type, 1 , function (err, data) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "创建成功"
                });
            } else {
                res.json({
                    success: false,
                    msg: "创建失败"
                });
            }
        });
    }else{
        adminModel.update(id, password, username, tel, type, function (err, data) {
            if (!err) {
                res.json({
                    success: true,
                    msg: "创建成功"
                });
            } else {
                res.json({
                    success: false,
                    msg: "创建失败"
                });
            }
        });
    }
});


router.post('/modifyPS', function (req, res) {
    if(!req.session || !req.session.admin){
        return res.json({
            success: false,
            msg : '没有权限'
        });
    }

    var id = req.session.admin.id
    var password = req.body.password;//明文
    password = commonUtils.md5(password);//加盐生成真实入库密码
    adminModel.updateTeacher(id, '', password, '', '', function (err, data) {
        if (!err) {
            res.json({
                success: true,
                msg: "创建成功"
            });
        } else {
            res.json({
                success: false,
                msg: "创建失败"
            });
        }
    });
});

router.post('/del', function (req, res) {
    if(!req.session || !req.session.admin || !req.session.admin.type == 1){
        return res.json({
            success: false,
            msg : '没有权限'
        });
    }

    var id = req.body.id;
    if(id == 1){
        return res.json({
            success: false,
            msg : '不能删除admin账户'
        });   
    }
    adminModel.del(id, function (err, data) {
        if (!err) {
            res.json({
                success: true,
                msg: "删除成功"
            });
        } else {
            res.json({
                success: false,
                msg: "删除失败"
            });
        }
    });
});

module.exports = router;

