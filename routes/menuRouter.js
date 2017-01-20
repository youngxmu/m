//管理模块
var express = require('express');
var config = require("../config");
var menuModel = require('../models/menuModel.js');
var commonUtils = require("../lib/utils.js");
var menuUtils = require("../lib/menuUtils.js");
var logger = require("../lib/log.js").logger("menuModel");
var router = express.Router();

router.post('/tree', function(req, res, next) {
	menuModel.queryAllMenu(function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("", err);
            res.json({
                success: false,
                msg: ""
            });
        } else {
            res.json({
                success: true,
                msg: "",
                data: {
                    list: result
                }
            });
        }
    });
});

router.post('/tree/:pid', function(req, res, next) {
    var pid = req.params.pid;
    
    var menuMap = menuUtils.getMenuMap();
    
    menu = menuMap[pid];
    // console.log(menuMap);
    var mids = [];
    mids.push(pid);
    for(var index in menu.submenu){
        var subId = menu.submenu[index];
        mids.push(subId);
        smenu = menuMap[subId];
        mids = mids.concat(smenu.submenu);
    }
    mid = mids.join(',');
    menuModel.queryAllMenuByIds(mid, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("", err);
            res.json({
                success: false,
                msg: ""
            });
        } else {
            res.json({
                success: true,
                msg: "",
                data: {
                    list: result
                }
            });
        }
    });
});

router.post('/add', function(req, res, next) {
    var name = req.body.name;
    var parent_id = req.body.parent_id;
    var mlevel = req.body.mlevel;
    
    
    logger.info("增加:admin-id-->", name, mlevel, parent_id);
    menuModel.addMenu(name, parent_id, mlevel, function (err, result) {
        if (err) {
            res.json({
                success: false,
                msg: "添加失败"
            });
        } else {
            menuUtils.refreshMenu();
            res.json({
                success: true,
                msg: "添加成功",
                data : result
            });
        }
    });
});

router.post('/update', function(req, res, next) {
    var name = req.body.name;
    var id = req.body.id;
    
    menuModel.updateMenu(id, name, function (err, result) {
        if (err) {
            res.json({
                success: false,
                msg: "添加失败"
            });
        } else {
            menuUtils.refreshMenu();
            res.json({
                success: true,
                msg: "添加成功"
            });
        }
    });
});

router.post('/del', function(req, res, next) {
    var id = req.body.id;
    
    menuModel.delMenu(id, function (err, result) {
        if (err) {
            logger.error("删除模特写真出错", err);
            res.json({
                success: false,
                msg: "删除模特写真出错"
            });
        } else {
            res.json({
                success: true,
                msg: "删除模特写真成功"
            });
        }
    });
});

router.get('/map', function(req, res, next) {
    var menuMap = menuUtils.getMenuMap();
    res.json(menuMap);
});

router.post('/submenu/:mid', function(req, res, next) {
    var mid = req.params.mid;
    menuModel.queryMenuByPid(mid, function (err, result) {
        if (err || !result || !commonUtils.isArray(result)) {
            logger.error("", err);
            res.json({
                success: false,
                msg: ""
            });
        } else {
            res.json({
                success: true,
                msg: "",
                data: {
                    list: result
                }
            });
        }
    });
});

router.post('/update/indexNo', function(req, res, next) {
    var menus = req.body.menus;
    var params = JSON.parse(menus);
    menuModel.updateMenuIndexNo(params, function (err, result) {
        if (err) {
            res.json({
                success: false,
                msg: "修改失败"
            });
        } else {
            menuUtils.refreshMenu();
            res.json({
                success: true,
                msg: "修改成功"
            });
        }
    });
});


module.exports = router;	

