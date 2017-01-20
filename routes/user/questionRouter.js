var express = require('express');
var config = require("../../config");
var commonUtils = require("../../lib/utils.js");
var logger = require("../../lib/log.js").logger("questionRouter");
var questionModel = require('../../models/questionModel.js');
var router = express.Router();

router.post('/list', function (req, res, next) {
    var type = req.body.type;
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    questionModel.queryQuestionTotalCount(type, function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        questionModel.queryQuestions(type, start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找出错", err);
                res.json({
                    success: false,
                    msg: "查找出错"
                });
            } else {
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





module.exports = router;

