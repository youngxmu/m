var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("voteModel");
var commonUtils = require("../lib/utils.js");


exports.queryVotes = function (name, start, pageSize, callback) {
    var sql = 'select * from vote where status = 1 ';
    var params = [];
    if (name && name !='') {
        sql += ' and name like "%' + name + '%" ';
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找试卷总数
exports.queryVoteTotalCount = function (name, callback) {
    var sql = 'select count(id) as count from vote where status = 1 ';
    var params = [];
    if (name && name !='') {
        sql += ' and name like "%' + name + '%" ';
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


exports.getVotes = function (name, start, pageSize, callback) {
    var sql = 'select * from vote where status = 1 ';
    var params = [];
    if (name && name !='') {
        sql += ' and name like "%' + name + '%" ';
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.getVoteTotalCount = function (name, callback) {
    var sql = 'select count(id) as count from vote where status = 1 ';
    var params = [];
    if (name && name !='') {
        sql += ' and name like "%' + name + '%" ';
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

exports.getOutVotes = function (name, start, pageSize, callback) {
    var sql = 'select * from vote where status = 0 ';
    var params = [];
    if (name && name !='') {
        sql += ' and name like "%' + name + '%" ';
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.getOutVoteTotalCount = function (name, callback) {
    var sql = 'select count(id) as count from vote where status = 0 ';
    var params = [];
    if (name && name !='') {
        sql += ' and name like "%' + name + '%" ';
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
exports.getVoteById = function (voteId, callback) {
    db.query("select * from vote where id = ?;", [voteId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            console.log(err);
            callback(err);    
        }
    });
};


exports.insertVote = function (name, description, qids, callback) {
    var sql = 'insert into vote ( ';
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
exports.updateVote = function (id, name, description, qids, callback) {
    var sql = 'update vote set name = ?, description =?, qids = ?, update_time = ?';
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
exports.updateVoteStatus = function (id, status, callback) {
    var sql = 'update vote set status = ? ';
    var params = [];
    sql += ' where id = ?;';
    params.push(status);
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
exports.delVote = function (id, callback) {
    var sql = 'delete from vote ';
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

exports.insertVoteHistory = function (pid, uid , qid, answer, rtanswer, callback) {
    var sql = 'insert into vote_history ( ';
    sql += 'pid, uid , qid, answer, rtanswer, create_time) ';
    sql += 'values(?,?,?,?,?,?);';
    db.query(sql,
        [pid, uid , qid, answer, rtanswer, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.queryVoteHistoryByPid = function (pid, callback) {
    var sql = 'select qid,answer,count(id) as count,rtanswer from vote_history where pid = ? group by pid,qid,answer order by id,answer;';
    var params = [];
    params.push(pid);
    db.query(sql, params, callback);
};

exports.queryVoteHistoryByQid = function (qid, callback) {
    var sql = 'select * from vote_history where qid = ?';
    var params = [];
    params.push(qid);
    db.query(sql, params, callback);
};

exports.queryVoteHistorys = function (uid, start, pageSize, callback) {
    var sql = 'select h.*,p.name,p.description from vote_history h left join vote p on h.pid = p.id where h.uid = ? order by create_time desc ';
    var params = [];
    sql += ' limit ?,?;';
    params.push(uid);
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找试卷总数
exports.queryVoteHistoryTotalCount = function (uid, callback) {
    var sql = 'select count(id) as count from vote_history where uid = ?;';
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
exports.getVoteHistoryById = function (id, callback) {
    db.query("select h.*,p.name,p.description from vote_history h left join vote p on h.pid = p.id  where h.id = ?;", [id], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


