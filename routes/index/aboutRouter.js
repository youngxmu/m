var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");
var commonUtils = require("../../lib/utils.js");
var indexModel = require('../../models/indexModel.js');
var router = express.Router();

router.get('/personal', function (req, res, next) {
    var data =  {
        link : 'index/about/personal',
        title : '关于我们',
        subtitle : '个人荣誉',
        type : 'p'
    };
    res.render('index/honor', data);
});

router.get('/org', function (req, res, next) {
    var data =  {
        link : 'index/about/personal',
        title : '关于我们',
        subtitle : '单位荣誉',
        type : 'u'
    };
    res.render('index/honor', data);
});



router.post('/personal', function (req, res, next) {
    var strs = ['2007全军先进个人','2009付腊平军队三等奖','2009杨洋全军优秀教员','2011三百工程优秀教材','2011总政一等奖','2012何轶琼教学三等奖','2012湖北省第七次优秀高等教育研究成果一等级奖','2013何轶琼教学二等奖','2013年全军军训一等奖','2014国防深改小组成员','2014何轶琼教学二等奖','2014年湖北省国防教育讲师团成员','201510全军学生军训30周年理论研讨三等奖'];
    var result = [];
    for(var index in strs){
        var str = strs[index];
        result.push({
            title : str,
            pic : 'img/index/about/p/' + str + '.jpg',
            link : ''
        });    
    }
    
    res.json({
        success : true,
        list : result
    });
});

router.post('/org', function (req, res, next) {
    var strs = ['2010学院教学二等奖','2011年全军一等奖','2012年湖北省一等奖','2012年院校三百工程优秀教材','2012学院教学三等奖','2012学院军事科研创新三等奖','2012学院优秀教育科研成果三等奖','2013国防动员标志铜奖','2013国防教育学科构建','2013年全军一等奖','2013三百工程优秀奖','2014年军区二等奖','2015年学院三等奖'];
    var result = [];
    for(var index in strs){
        var str = strs[index];
        result.push({
            title : str,
            pic : 'img/index/about/u/' + str + '.jpg',
            link : ''
        });    
    }
    
    res.json({
        success : true,
        list : result
    });
});


module.exports = router;

