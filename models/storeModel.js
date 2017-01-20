var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("storeModel");
var commonUtils = require("../lib/utils.js");


exports.queryInfos = function (callback) {
    var sql = 'select * from info; ';
    var params = [];
    db.query(sql, params, callback);
};


exports.queryIndexInfos = function (callback) {
    var sql = 'select * from info where content != 0 limit 5; ';
    var params = [];
    db.query(sql, params, callback);
};



exports.queryInfoById = function (id, callback) {
    var sql = 'select WordContent as content from info3 where PosId = ?; ';
    var params = [id];
    db.query(sql, params, callback);
};