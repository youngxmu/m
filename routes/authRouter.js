var express = require('express');
var adminModel = require('../models/adminModel.js');
var userModel = require('../models/userModel.js');
var config = require("../config");
var commonUtils = require("../lib/utils.js");
var logger = require("../lib/log.js").logger("authRouter");
var router = express.Router();

router.get('/admin/login', function (req, res, next) {
    res.render('admin/login');
});

router.get('/user/login', function (req, res, next) {
    res.render('user/login');
});


router.post('/admin/islogin', function (req, res, next) {
    if(req.session && req.session.admin){
        return res.json({
            success : true
        });
    }
    return res.json({
        success : false
    });
});

router.post('/user/islogin', function (req, res, next) {
    if(req.session && req.session.user){
        return res.json({
            success : true
        });
    }
    return res.json({
        success : false
    });
});

router.post('/admin/login', function (req, res, next) {
    var password = req.body.password.trim();
    var username = req.body.username.trim();

    logger.info("管理员尝试登陆", username, password);

    if (!username) {
        return res.render('error', {
            success: false,
            msg: "用户名不能为空"
        });
    }
    if (!password) {
        return res.render('error', {
            success: false,
            msg: "密码不能为空"
        });
    }

    password = commonUtils.md5(password);
    adminModel.query(username, password, function (err, result) {
        if (!err && commonUtils.isArray(result) && result.length > 0) {
            var admin = result[0];
            delete admin.password;
            req.session.admin = admin;
            //登录成功
            res.redirect(config.redirectPath + 'admin/index');
        } else {
            res.render('error', {
                success: false,
                msg: "用户不存在"
            });
        }
    });
});

router.post('/user/login', function (req, res, next) {
    var sysType = req.body.sysType;
    if(!sysType){
        sysType = 'resource';
    }else{
        sysType = sysType.trim();
    }
    
    var password = req.body.password.trim();
    var email = req.body.email.trim();

    logger.info("用户尝试登陆", email, password);

    var view = sysType + '/list';
    var errView = 'user/' + sysType + '/index';
    if (!email || !password) {
        return res.render(errView, {
            errmsg: "邮箱/密码不能为空"
        });
    }

    password = commonUtils.md5(password);
    console.log('user logining' + email);
    userModel.queryUserByEmail(email, function (err, result) {
        if (!err && commonUtils.isArray(result) && result.length > 0) {
            var user = result[0];
            if(user.password != password){
                return res.render(errView, {
                    success: false,
                    errmsg: "用户名或密码错误"
                });
            }

            if(user.status != 1){
                return res.render(errView, {
                    success: false,
                    errmsg: "账户未激活"
                });
            }
            delete user.password;
            req.session.user = user;
            res.locals.username = user.name;
            //登录成功
            // res.redirect('/moka/index');
            console.log('user login');
            res.redirect(config.redirectPath +view);
        } else {
            return res.render(errView, {
                success: false,
                errmsg: "用户名或密码错误"
            });
        }
    });
});

router.get('/admin/logout', function (req, res, next) {
    delete req.session.admin;
    res.redirect(config.redirectPath + 'auth/admin/login');
});

router.get('/user/logout', function (req, res, next) {
    delete req.session.user;
    res.redirect(config.redirectPath + 'index');
});

module.exports = router;

