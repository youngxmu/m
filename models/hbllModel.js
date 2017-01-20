var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("hbllModel");
var commonUtils = require("../lib/utils.js");

exports.query = function (mid, callback) {
    var sql = 'select * from hbll where mid = ?; ';
    var params = [mid];
    db.query(sql, params, callback);
};

exports.insert = function (mid, content, callback) {
    db.query("insert into hbll (mid, content) values(?,?);",
        [mid, content],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.update = function (mid, content, callback) {
    db.query("update hbll set content = ? where mid = ?;",
        [content, mid],
        function (err, result) {
            callback(err, result);
        }
    );
};