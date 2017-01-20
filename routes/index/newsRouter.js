var express = require('express');
var config = require("../../config");
var logger = require("../../lib/log.js").logger("indexRouter");
var commonUtils = require("../../lib/utils.js");
var newsModel = require('../../models/newsModel.js');
var router = express.Router();

router.get('/list', function (req, res, next) {
    // res.render('index/science-desc');
    res.render('index/news-list');
});

// /** 获取新闻 */
// router.post('/news', function (req, res, next) {
//     newsModel.queryNewsList(function(err, results){
//         if(err){
//             return res.json({
//                 success : false
//             });
//         }else{
//             return res.json({
//                 success : true,
//                 list : results
//             });
//         }
//     });
// });


//基本列表
router.post('/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    newsModel.queryNewsTotalCount(function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        newsModel.queryNews(start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找出错", err);
                return res.json({
                    success: false,
                    msg: "查找出错"
                });
            } else {
                for (var i in result) {
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


module.exports = router;

