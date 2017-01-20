var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("paperPaper");
var commonUtils = require("../lib/utils.js");


exports.queryPapers = function (name, start, pageSize, callback) {
    var sql = 'select * from paper where status = 1 ';
    var params = [];
    if (name && name != '') {
        sql += ' and name like %' + name + '% ';
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找试卷总数
exports.queryPaperTotalCount = function (name, callback) {
    var sql = 'select count(id) as count from paper where status = 1 ';
    var params = [];
    if (name && name != '') {
        sql += ' and name like %' + name + '% ';
    }

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找试卷总数出错", err);
            callback(0);
        }
    });
};


//根据id获取试卷
exports.getPaperById = function (paperId, callback) {
    db.query("select * from paper where id = ?;", [paperId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


exports.insertPaper = function (name, description, qids, callback) {
    var sql = 'insert into paper ( ';
    sql += 'name, description, qids, status, create_time) ';
    sql += 'values(?,?,?,?,?);';
    db.query(sql,
        [name, description, qids, 1, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改试卷个人信息
exports.updatePaper = function (id, name, description, qids, callback) {
    var sql = 'update paper set name = ?, description =?, qids = ?, update_time = ?';
    var params = [];
    params.push(name);
    params.push(description);
    params.push(qids);
    params.push(new Date());
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改试卷出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};


//编辑、修改试卷个人信息
exports.delPaper = function (id, callback) {
    var sql = 'update paper set status = 0';
    var params = [];
    sql += ' where id = ?;';
    params.push(id);

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            logger.error("修改试卷出错", err);
            callback(err);
        } else {
            callback(null);
        }
    });
};

exports.insertPaperHistory = function (uid, pid, answer, callback) {
    var sql = 'insert into paper_history ( ';
    sql += 'uid, pid, answer, create_time) ';
    sql += 'values(?,?,?,?);';
    db.query(sql,
        [uid, pid, answer, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.queryPaperHistorys = function (uid, start, pageSize, callback) {
    var sql = 'select h.*,p.name,p.description from paper_history h left join paper p on h.pid = p.id where h.uid = ? order by create_time desc ';
    var params = [];
    sql += ' limit ?,?;';
    params.push(uid);
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找试卷总数
exports.queryPaperHistoryTotalCount = function (uid, callback) {
    var sql = 'select count(id) as count from paper_history where uid = ?;';
    var params = [];
    params.push(uid);
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            console.log(result[0]);
            callback(result[0].count);
        } else {
            logger.error("查找试卷总数出错", err);
            callback(0);
        }
    });
};


//根据id获取试卷
exports.getPaperHistoryById = function (id, callback) {
    db.query("select h.*,p.name,p.description from paper_history h left join paper p on h.pid = p.id  where h.id = ?;", [id], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


exports.queryExams = function ( start, pageSize, callback) {
    var sql = 'select * from paper where status = 1 and type = 1';
    var params = [];
    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找试卷总数
exports.queryExamTotalCount = function (callback) {
    var sql = 'select count(id) as count from paper where status = 1 and type = 1';
    var params = [];
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找试卷总数出错", err);
            callback(0);
        }
    });
};

exports.queryHideIds = function (callback) {
    var sql = 'select * from info_paper where id = 1';
    var params = [];
    db.query(sql, params, callback);
};

exports.updateHideIds = function (ids, callback) {
    var sql = 'update info_paper set hide_ids = ? where id = 1;';
    var params = [ids];
    db.query(sql, params, callback);
};