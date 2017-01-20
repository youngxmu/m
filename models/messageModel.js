var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("messageModel");
var commonUtils = require("../lib/utils.js");
var config = require("../config");

exports.queryMessageList = function (start, pageSize, callback) {
    var sql = 'select * from message';
    var params = [];
    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.queryMessageTotalCount = function (callback) {
    var sql = 'select count(id) as count from message where 1=1 ';
    var params = [];
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};

exports.getMessageById = function (messageId, callback) {
    db.query("select * from message where id = ?;", [messageId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};

exports.insertMessage = function (title, author, content, callback) {
    var sql = 'insert into message (title, author, content, create_time) values(?,?,?,?);';
    db.query(sql,[title, author, content , new Date()], callback);
};

exports.updateMessage = function (id, title, author, content, callback) {
    var sql = 'update message set create_time = create_time';
    var params = [];
    if (title) {
        sql += ',title = ? ';
        params.push(title);
    }
    if (author) {
        sql += ',author = ? ';
        params.push(author);
    }
    if (content) {
        sql += ',content = ? ';
        params.push(content);
    }
    sql += ' where id = ?;';
    params.push(id);
    db.query(sql, params, function (err, result) {
        callback(err);
    });
};

exports.delMessage = function (id, callback) {
    var sql = 'delete from message where id = ?;';
    var params = [id];
    db.query(sql, params, function (err, result) {
        if (!err) {
            callback(null);
        } else {
            logger.error("删除文章出错", err);
            callback(err);
        }
    });
};
