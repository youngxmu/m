var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");
var commonUtils = require("../../lib/utils.js");
var menuUtils = require("../../lib/menuUtils.js");
var sysUtils = require("../../lib/sysUtils.js");

var articleModel = require('../../models/articleModel.js');
var infoModel = require('../../models/infoModel.js');
var paperModel = require('../../models/paperModel.js');
var newsModel = require('../../models/newsModel.js');
var indexModel = require('../../models/indexModel.js');
var menuModel = require('../../models/menuModel.js');
var resourceModel = require('../../models/resourceModel.js');
var messageModel = require('../../models/messageModel.js');

var router = express.Router();


var renderData = {
    title : '学术成果',
    link : 'index/science/list',
};

var dict = {
    1 : '课题',
    2 : '专著',
    3 : '论文',
    4 : '教材',
    5 : '研究报告'
}
router.get('/list', function (req, res, next) {
    res.render('index/science-desc');
});

router.get('/list/:moduleId', function (req, res, next) {
    var moduleId = req.params.moduleId;
    var title = dict[moduleId];
    var data = renderData;
    data.mid = moduleId;
    data.subtitle = title;
    res.render('index/science', data);
});
// router.post('/list', function (req, res, next) {
//     var pageNo = parseInt(req.body.pageNo);
//     var pageSize = parseInt(req.body.pageSize);
//     var moduleId = req.body.moduleId;
//     var title = dict[moduleId];
//     var type = req.body.type;
//     if(!type || type == 'undefined'){
//         type = '';
//     }
//     if(!title || title == 'undefined'){
//         title = '';
//     }

//     resourceModel.queryResourceByTitleTotalCount(title, type, function (totalCount) {
//         var totalPage = 0;
//         if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
//         else totalPage = totalCount / pageSize + 1;
//         totalPage = parseInt(totalPage, 10);
//         var start = pageSize * (pageNo - 1);
//         resourceModel.queryResourceByTitle(title, type, start, pageSize, function (err, result) {
//             if (err || !result || !commonUtils.isArray(result)) {
//                 logger.error("查找文章出错", err);
//                 res.json({
//                     success: false,
//                     msg: "查找文章出错"
//                 });
//             } else {
//                 for (var i in result) {
//                     // result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
//                     var date = new Date(result[i].create_time);
//                     result[i].create_time = commonUtils.formatDate(date);
//                 }
//                 res.json({
//                     success: true,
//                     msg: "查找文章成功",
//                     data: {
//                         totalCount: totalCount,
//                         totalPage: totalPage,
//                         currentPage: pageNo,
//                         list: result
//                     }
//                 });
//             }
//         });
//     });
// });

var picDict = {
    1 : [],
    2 : ['2011国防教育封面','2011中外比较封面','2012国防教育新论封面','2013国防文化封面','2013和平发展封面','2014边疆民族封面','2014学科封面'],
    3 : ['把尖刀磨的更锋利','刍议小班化教学在任职教育中的运用','从历史角度看安倍史观的谬误','渡江战役对锻造能打胜仗军队的启示','对二炮常规导弹作战模拟实验室建设的思考','基于新型媒体深化国防教育的新思考','加强教员队伍建设促进任职教育有效教学','科学建构二炮预备役部队训练内容','论文集','论延安时期我党国防教育的理论发展与实践探索','浅谈我国国防教育的历史特征','适应体系作战需要-抓好二炮预备役部队重点对象训练','学院壮大我成长','走进校园之前-先做好自己的功课'],
    4 : ['大学军事教程','大学生军事教程','高校国防教育-陈云金&沈友生','高校国防教育教程','国防教育教程','军事理论教程','派遣军官手册'],
    5 : []
}


router.post('/list', function (req, res, next) {
    var moduleId = req.body.moduleId;
    var strs = picDict[moduleId];
    var result = [];
    for(var index in strs){
        var str = strs[index];
        result.push({
            title : str,
            pic : 'img/index/science/s'+ moduleId +'/' + str + '.jpg',
            link : ''
        });    
    }
    res.json({
        success : true,
        list : result
    });
});

router.post('/list/:moduleId', function (req, res, next) {
    var moduleId = req.params.moduleId;
    var strs = picDict[moduleId];
    var result = [];
    for(var index in strs){
        var str = strs[index];
        result.push({
            title : str,
            pic : 'img/index/science/s'+ moduleId +'/' + str + '.jpg',
            link : ''
        });    
    }
    res.json({
        success : true,
        list : result
    });
});


module.exports = router;

