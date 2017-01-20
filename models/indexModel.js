var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("indexModel");
var commonUtils = require("../lib/utils.js");

exports.queryInfoById = function (mid, callback) {
    var sql = 'select * from index_info where index_mid = ?; ';
    var params = [mid];
    db.query(sql, params, callback);
};

exports.updateInfo = function (mid, content, callback) {
    db.query("update index_info set content = ? where index_mid = ?;",
        [content, mid],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.queryUpById = function (mid, callback) {
    var sql = 'select * from resource where id in (select aid from index_data where mid = ?); ';
    var params = [mid];
    db.query(sql, params, callback);
};

exports.queryUpByIds = function (ids, callback) {
    var sql = 'select * from resource where id in (' + ids + '); ';
    var params = [];
    db.query(sql, params, callback);
};

// exports.getUp = function (mid, callback) {
//     db.query("select * from index_data where mid = ?;",
//         [mid],
//         function (err, result) {
//             callback(err, result);
//         }
//     );
// };

exports.getUp = function (moduleId, callback) {
    db.query("select * from index_module where id = ?;", [moduleId], function (err, result) {
            callback(err, result);
        }
    );
};

exports.updateUp = function (mid, aid, callback) {
    db.query("update index_module set aids = ? where id = ?;",
        [aid, mid],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.queryModules = function (callback) {
    var sql = 'select * from index_module;';
    var params = [];
    db.query(sql, params, callback);
};

exports.updateModule = function (id, keywords, type,  callback) {
    var sql = 'update index_module set keywords = ? where id = ?;';
    if(type == 1){
        sql = 'update index_module set upkeywords = ? where id = ?;';
    }
    db.query(sql, [keywords, id], function (err, result) {
        callback(err, result);
    });
};


exports.queryTeamer = function (callback) {
    db.query("select * from index_teamer order by `index`;", [], function (err, result) {
            callback(err, result);
        }
    );
};

exports.insertTeamer = function (name, desc, avatar, callback) {
    db.query("insert into index_teamer(name, info, avatar) values (?,?,?);",
        [name, desc, avatar],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.updateTeamer = function (id, name, desc, avatar, callback) {
    var sql = 'update index_teamer set ' ;
    sql += ' name=? ';
    sql += ' ,info=? ';
    sql += ' ,avatar=? ';
    sql += 'where id = ?;';
    var params = [];
    params.push(name);
    params.push(desc);
    params.push(avatar);
    params.push(id);
    db.query(sql, params, function (err, result) {
            callback(err, result);
        }
    );
};

exports.delTeamer = function (id, callback) {
    var sql = 'delete from index_teamer where id = ?;';
    var params = [];
    params.push(id);
    db.query(sql, params, function (err, result) {
            callback(err, result);
        }
    );
};

// exports.sortTeamer = function (teamers, callback) {
//     for(var key in teamers){
//         var sql = '';
//         var teamer = teamers[key];
//         sql += 'update index_teamer set `index` =  ' + teamer.index + ' where id = ' + teamer.id + ' ;';
//             sql += ';';
//     }

//     db.query(sql, [], callback);
// };

exports.sortTeamer = function (teamer, callback) {
        var sql = '';
        sql += 'update index_teamer set `index` =  ' + teamer.index + ' where id = ' + teamer.id + ' ;';
        sql += ';';
    db.query(sql, [], callback);
};
