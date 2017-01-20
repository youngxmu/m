var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("menuModel");

exports.queryMenuById = function (id, callback) {
    var sql = 'select * from menu where id = ?;';
    var params = [id];
    db.query(sql, params, callback);
};

exports.updateMenuById = function (id, keyword, callback) {
    var sql = 'update menu set keyword = ? where id = ?;';
    var params = [keyword, id];
    db.query(sql, params, callback);
};

exports.queryAllMenu = function (callback) {
    var sql = 'select * from menu where status = 1;';
    var params = [];
    db.query(sql, params, callback);
};

exports.queryAllMenuByIds = function (pid, callback) {
    var sql = 'select * from menu where status = 1 and parent_id in ('+ pid +');';
    var params = [];
    db.query(sql, params, callback);
};


exports.addMenu = function (name, parent_id, mlevel, callback) {
    if (!parent_id) {
        parent_id = 0;
    }

    if (!mlevel) {
        mlevel = 0;
    }

    db.query("insert into menu (name, parent_id, mlevel) values(?,?,?);",
        [name, parent_id, mlevel],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.updateMenu = function (id, name, callback) {
    db.query("update menu set name = ? where id = ?;",
        [name, id],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.delMenu = function (id, callback) {
    db.query("update menu set status = 0 where id = ?;",
        [id],
        function (err, result) {
            callback(err, result);
        }
    );
};


exports.queryMenuByPid = function (pid, callback) {
    var sql = 'select * from menu where parent_id = ? order by index_no;';
    var params = [pid];
    db.query(sql, params, callback);
};


exports.updateMenuIndexNo = function (menus, callback) {
    var params = [];
    var sql = 'update menu set index_no = case ';
    for(var index in menus){
        sql += ' when id = ? then ? ';
        var menu = menus[index];
        params.push(menu.id);
        params.push(menu.index);
    }
    sql += ' end;';
    db.query(sql, params, callback);
};