var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("checkModel");
var commonUtils = require("../lib/utils.js");


/**
 * 审核文章：更改model表status字段，在审核记录表history中添加一条审核记录
 *
 * @param adminId 管理员id
 * @param modelId 审核的文章id
 * @param status 审核记录：-1：禁用，0：未审核，1：已审核通过，2：审核拒绝
 * @param description 本次审核的文字描述，比如拒绝理由
 * @param callback
 */
exports.checkArticle = function (admin_id, article_id, status, description, callback) {
    logger.info("审核文章", admin_id, article_id, status, description);
    db.query("select * from article where id = ? and status = 0;", [article_id], function (err, result) {
        if (!err && result && result.length > 0) {//修改文章状态成功
            var article = result[0];
            db.query("update article set status = ? where id = ?", [status, article_id], function (err, result) {
                logger.info("审核文章时更新文章状态结果",err, result);
                if (!err && result && result.affectedRows && result.affectedRows>=1) {//修改文章状态成功
                    db.query("insert into history(admin_id, article_id, user_id, status, description, create_time) values(?,?,?,?,?,?)",
                        [admin_id, article_id, article.author_id, status, description, new Date()], function (err, result) {
                            if(err){
                                callback && callback(err, result);
                            }else{
                                db.query("update user set score = score + 2 where id = ?", [article.author_id], function (err, result) {
                                    callback && callback(err, result);
                                });
                            }
                        });
                } else {
                    callback && callback(err, result);
                }
            });
        } else {
            callback && callback(err, result);
        }
    });
   
};

/**
 * 查询文章审核历史
 * @param modelId
 * @param callback
 */
exports.history = function (article_id, callback) {
    logger.info("查询文章审核历史", modelId);
    db.query("select * from history where article_id = ?", [article_id], callback);
};
