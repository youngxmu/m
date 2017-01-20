var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("infoModel");
var commonUtils = require("../lib/utils.js");

exports.queryInfoById = function (id, callback) {
    var sql = 'select * from info where id = ?; ';
    var params = [id];
    db.query(sql, params, callback);
};

exports.queryInfos = function (callback) {
    var sql = 'select id,name,parent_id from info; ';
    var params = [];
    db.query(sql, params, callback);
};


exports.queryIndexInfos = function (callback) {
    var sql = 'select * from info where content != 0 limit 5; ';
    var params = [];
    db.query(sql, params, callback);
};




exports.addInfo = function (name, content, parent_id, mlevel, callback) {
    if (!parent_id) {
        parent_id = 0;
    }

    if (!mlevel) {
        mlevel = 0;
    }

    db.query("insert into info (id,name, content, parent_id) values(uuid(),?,?,?);",
        [name, content, parent_id],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.updateInfo = function (id, name, content, callback) {
    db.query("update info set content = ? where id = ?;",
        [content, id],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.delInfo = function (id, callback) {
    db.query("delete from info where id = ?;",
        [id],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.insert = function (name, content, parent_id, callback) {
    if (!parent_id) {
        parent_id = 0;
    }
    db.query("insert into info (id, name, content, parent_id) values(uuid(),?,?,?);",
        [name, content, parent_id],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.update = function (id, name, content, callback) {
    console.log(name +' '+  content+' '+ id);
    db.query("update info set name = ?, content = ? where id = ?;",
        [name, content, id],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.del = function (id, callback) {
    db.query("delete from info where id = ?;",
        [id],
        function (err, result) {
            callback(err, result);
        }
    );
};
