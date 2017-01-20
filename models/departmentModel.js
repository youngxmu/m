var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("departmentDepartment");
var commonUtils = require("../lib/utils.js");


exports.queryDepartments = function (name, start, pageSize, callback) {
    var sql = 'select * from department where status = 1 ';
    var params = [];
    if (name || name == 0) {
        sql += ' and name like %' + name + '% ';
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找单位总数
exports.queryDepartmentTotalCount = function (name, callback) {
    var sql = 'select count(id) as count from department where status = 1 ';
    var params = [];
    if (name || name == 0) {
        sql += ' and name like %' + name + '% ';
    }

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找单位总数出错", err);
            callback(0);
        }
    });
};


//根据id获取单位
exports.getDepartmentById = function (departmentId, callback) {
    db.query("select * from department where id = ?;", [departmentId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


exports.insert = function (name, description, qids, callback) {
    var sql = 'insert into department ( ';
    sql += 'name, description, create_time) ';
    sql += 'values(?,?,?);';
    db.query(sql,
        [name, description, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改单位个人信息
exports.update = function (id, name, description, callback) {
    var sql = 'update department set name = ?, description =?';
    var params = [];
    params.push(name);
    params.push(description);
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改单位出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};
 

//编辑、修改单位个人信息
exports.delDepartment = function (id, callback) {
    var sql = 'update department set status = 0';
    var params = [];
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改单位出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

