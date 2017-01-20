var db = require('../lib/db.js');

var logger = require("../lib/log.js").logger("newsModel");
var commonUtils = require("../lib/utils.js");


exports.queryNewsList = function (callback) {
    var sql = 'select * from news order by news.index limit 0,5';
    var params = [];
    db.query(sql, params, callback);
};


exports.insertNews = function (title,link,pic_url,index,callback) {
    var sql = 'insert into news (title,link,pic_url,`index`) values(?,?,?,?);';
    db.query(sql,[title,link,pic_url,index],
        function (err, result) {
            callback(err, result);
        }
    );
};


//编辑、修改专家个人信息
exports.delAllNews = function (callback) {
    var sql = 'delete from news';
    var params = [];
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("删除出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


/************/

exports.queryNewsById = function (id, callback) {
    var sql = 'select * from index_news where id = ?';
    var params = [id];
    db.query(sql, params, callback);
};

exports.insert = function (title, content, cover, callback) {
    var sql = 'insert into index_news (title, content, cover,create_time) values(?,?,?,?);';
    db.query(sql,[title, content, cover, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.update = function (id, title, content, cover, callback) {
    var sql = 'update index_news set title = ?,content=?,cover=? where id = ?;';
    db.query(sql,[title, content, cover, id],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.del = function (id, callback) {
    var sql = 'delete from index_news where id = ?;';
    var params = [id];
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("删除出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


exports.queryNews = function (start, pageSize, callback) {
    var sql = 'select * from index_news where 1=1 ';
    var params = [];
    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找文章总数
exports.queryNewsTotalCount = function (callback) {
    var sql = 'select count(id) as count from index_news where 1=1 ';
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