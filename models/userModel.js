var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("modelModel");
var commonUtils = require("../lib/utils.js");



//根据“是否虚拟”“创建来源”查找宅男列表
exports.queryUserList = function (isVirtual, createFrom, start, pageSize, callback) {
    db.query("select * from user order by create_time desc limit ?,?;",
        [start, pageSize], callback);
};

//根据“是否虚拟”“创建来源”查找宅男总数
exports.getUserTotalCount = function (isVirtual, createFrom, callback) {
    db.query("select count(id) as count from user;",
        [],
        function (err, result) {
            if (!err && result && result[0]) {
                callback(result[0].count);
            } else {
                logger.error("查找宅男总数出错", err);
                callback(0);
            }
        });
};

//根据id查询宅男
exports.queryUserById = function (userId, callback) {
    db.query("select * from user where id=? limit 1", [userId], callback);
};

//根据id查询宅男
exports.queryUserByEmail = function (email, callback) {
    db.query("select * from user where email=? limit 1", [email], callback);
};


//根据昵称模糊查询宅男
exports.queryUserByName = function (nickname, callback) {
    db.query('select * from user where name like "%' + nickname + '%" order by create_time desc',
        [], callback);
};

//根据宅男手机精确查询宅男
exports.queryUserByTel = function (tel, callback) {
    db.query("select * from user where tel =?", [tel], callback);
};


exports.insertUser = function (email, tel, name, password, score, status, callback) {
    var sql = 'insert into user ';
    sql += '(email, tel, name, password, score, create_time, status) ';
    sql += 'values(?,?,?,?,?,?,?);';

    db.query(sql, [email, tel, name, password, score, new Date(), status],
        function (err, result) {
            if (!err) {
                callback(null, result);
            }
            callback(err, result);
        });
};

exports.updateUserStatus = function (email, status, callback) {
    db.query("update user set status = ? where email = ?;", [status, email], callback);
}


exports.insert = function (name, tel, email, password, callback) {
    var sql = 'insert into user ';
    sql += '(name, tel, email, password, create_time, status) ';
    sql += 'values(?,?,?,?,?,?);';
    db.query(sql, [name, tel, email, password, new Date(), status], callback);
};

exports.update = function (id, name, tel, email, password, callback) {
    var sql = 'update user set name = ? ';
    sql += ' ,tel = ? ';
    sql += ' ,email = ? ';
    sql += ' ,password = ? ';
    sql += ' where id = ?;';
    db.query(sql, [name, tel, email, password, id], callback);
};

exports.del = function (id, callback) {
    var sql = 'delete from user where id = ?;';
    db.query(sql, [id], callback);
};
exports.insertUsers = function (params, callback) {
    var sql = 'insert into user ';
    sql += ' (name, tel, email, password, create_time, status) ';
    sql += ' values ? ;';
    db.query(sql, [params],callback);
};