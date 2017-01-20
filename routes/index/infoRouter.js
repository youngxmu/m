var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");
var commonUtils = require("../../lib/utils.js");
var indexModel = require('../../models/indexModel.js');
var router = express.Router();

router.get('/desc', function (req, res, next) {
    var data =  {
        link : 'index/info/desc',
        title : '中心简介',
        mid : 100101
    };
    var mid = data.mid;
    indexModel.queryInfoById(mid, function(err, result){
        if(err || result.length == 0){
            res.render('error', {
                msg : '找不到资源啦'
            });
        }else{
            data.content = result[0].content;
            res.render('index/desc', data);
        }
    });
});

router.get('/org', function (req, res, next) {
    var data =  {
        link : 'index/info/org',
        title : '研究队伍',
        mid : 100102
    };
    // var mid = data.mid;
    indexModel.queryTeamer(function (err, teamers) {
        if(err){
            res.render('error', {
                msg : '找不到资源啦'
            });
        }
        var content = '<div class="teamer-title">国防教育中心研究队伍</div>';
        var length = teamers.length;
        content += '<div class="teamer-panel">';
        var html = '';
        for(var i=0;i<length;i++){
            var teamer = teamers[i];
            content += '<dl>';
            content += '<dd>' + (i+1) + '</dd>';
            content += '<dd><img src="' + teamer.avatar + '"></dd>';
            content += '<dd>' + teamer.info + '</dd>';
            content += '</dl>';
        }
        content += '</div>';
        data.content = content;
        // data.teamers = teamers;
        res.render('index/desc', data);
    });
});


router.get('/about', function (req, res, next) {
    var data =  {
        link : 'index/info/about',
        title : '关于我们',
        mid : 1005
    };
    var mid = data.mid;
    indexModel.queryInfoById(mid, function(err, result){
        if(err || result.length == 0){
            res.render('error', {
                msg : '找不到资源啦'
            });
        }else{
            data.content = result[0].content;
            res.render('index/desc', data);
        }
    });
});

router.get('/science', function (req, res, next) {
    var data =  {
        link : 'index/info/science',
        title : '学术成果',
        mid : 100104
    };
    var mid = data.mid;
    indexModel.queryInfoById(mid, function(err, result){
        if(err || result.length == 0){
            res.render('error', {
                msg : '找不到资源啦'
            });
        }else{
            data.content = result[0].content;
            res.render('index/desc', data);
        }
    });
});


module.exports = router;

