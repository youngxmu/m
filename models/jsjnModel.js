var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("jsjnModel");
var commonUtils = require("../lib/utils.js");


exports.queryIndexInfos = function (callback) {
    var sql = 'select * from jsjnxx where content != 0 limit 10; ';
    var params = [];
    db.query(sql, params, callback);
};



exports.queryInfoById = function (id, callback) {
    var sql = 'select * from jsjnxx where id = ?; ';
    var params = [id];
    db.query(sql, params, callback);
};

exports.queryInfos = function (callback) {
    var sql = 'select id,title,parent_id from jsjnxx; ';
    var params = [];
    db.query(sql, params, callback);
};

exports.queryInfosByType = function (type, callback) {
    var sql = 'select id,type,title,parent_id from jsjnxx where type != "教案" order by index_no; ';
    if(type == '教案'){
        sql = 'select id,type,title,parent_id from jsjnxx where type = "教案" order by index_no; ';
    }
    
    var params = [type];
    db.query(sql, params, callback);
};



exports.addInfo = function (title, content, parent_id, mlevel, callback) {
    if (!parent_id) {
        parent_id = 0;
    }

    if (!mlevel) {
        mlevel = 0;
    }

    db.query("insert into jsjnxx (title, content) values(?,?);",
        [title, content],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.updateInfo = function (id, title, content, callback) {
    db.query("update jsjnxx set title = ?, content = ? where id = ?;",
        [title, content, id],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.delInfo = function (id, callback) {
    db.query("delete from jsjnxx where id = ?;",
        [id],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.insert = function (type, title, content, parent_id, callback) {
    db.query("insert into jsjnxx (type, title, content, parent_id) values(?,?,?,?);",
        [type, title, content, parent_id],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.update = function (id, title, content, callback) {
    db.query("update jsjnxx set title = ?, content = ? where id = ?;",
        [title, content, id],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.del = function (id, callback) {
    db.query("delete from jsjnxx where id = ?;",
        [id],
        function (err, result) {
            callback(err, result);
        }
    );
};