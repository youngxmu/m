var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("jsllModel");
var commonUtils = require("../lib/utils.js");

exports.queryIndexInfos = function (callback) {
    var sql = 'select * from jsllxx where content != 0 limit 10; ';
    var params = [];
    db.query(sql, params, callback);
};

exports.queryInfoById = function (id, callback) {
    var sql = 'select * from jsllxx where id = ?; ';
    var params = [id];
    db.query(sql, params, callback);
};

exports.queryInfos = function (callback) {
    var sql = 'select id,title from jsllxx; ';
    var params = [];
    db.query(sql, params, callback);
};

exports.queryInfosByType = function (type, callback) {
    var sql = 'select * from jsllxx where type = ?; ';
    var params = [type];
    db.query(sql, params, callback);
};

exports.insert = function (type, title, content, pid, callback) {
    db.query("insert into jsllxx (type, title, content, pid) values(?,?,?,?);", [type, title, content, pid], callback);
};


exports.update = function (id, title, content, callback) {
    db.query("update jsllxx set title = ?, content = ? where id = ?;", [title, content, id], callback);
};

exports.del = function (id, callback) {
    db.query("delete from jsllxx where id = ?;",[id],callback);
};