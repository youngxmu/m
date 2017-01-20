var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("examRouter");
var commonUtils = require("../lib/utils.js");


exports.queryExams = function (name, start, pageSize, callback) {
    var sql = 'select * from exam where status = 1 ';
    var params = [];
    if (name && name != '') {
        sql += ' and name like %' + name + '% ';
    }

    sql += ' limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.queryExamTotalCount = function (name, callback) {
    var sql = 'select count(id) as count from exam where status = 1 ';
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



// exports.queryExams = function (start, pageSize, callback) {
//     var sql = 'select * from exam where status = 1 and type = 1';
//     var params = [];
//     sql += ' limit ?,?;';
//     params.push(start);
//     params.push(pageSize);
//     db.query(sql, params, callback);
// };

// //根据“是否虚拟”“创建来源”查找试卷总数
// exports.queryExamTotalCount = function (callback) {
//     var sql = 'select count(id) as count from exam where status = 1 and type = 1';
//     var params = [];
//     db.query(sql, params, function (err, result) {
//         if (!err && result && result[0]) {
//             callback(result[0].count);
//         } else {
//             logger.error("查找试卷总数出错", err);
//             callback(0);
//         }
//     });
// };



exports.getExamById = function (examId, callback) {
    db.query("select * from exam where id = ?;", [examId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


exports.insertExam = function (name, description, qids, callback) {
    var sql = 'insert into exam ( ';
    sql += 'name, description, qids, status, create_time) ';
    sql += 'values(?,?,?,?,?);';
    db.query(sql,
        [name, description, qids, 1, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

exports.updateExam = function (id, name, description, qids, callback) {
    var sql = 'update exam set name = ?, description =?, qids = ?, update_time = ?';
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

exports.delExam = function (id, callback) {
    var sql = 'update exam set status = 0';
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


/** user_exam **/
exports.insertUserExam = function (uid, exam_id, callback) {
    var sql = 'insert into user_exam (uid, exam_id, status, start_time) values(?,?,?,?);';
    var params = [];
    params.push(uid);
    params.push(exam_id);
    params.push(1);
    params.push(new Date());
    db.query(sql, params, callback);
};


exports.queryUserExams = function (uid, callback) {
    var sql = 'select * from user_exam where uid=?;';
    var params = [];
    params.push(uid);
    db.query(sql, params, callback);
};

exports.queryUserExam = function (uid, exam_id, callback) {
    var sql = 'select * from user_exam where uid=? and exam_id = ?;';
    var params = [];
    params.push(uid);
    params.push(exam_id);
    db.query(sql, params, callback);
};


/** user_exam **/
exports.updateUserExamStatus = function (uid, exam_id, callback) {
    var sql = 'update user_exam set status = 2 where uid = ? and exam_id = ?';
    var params = [];
    params.push(uid);
    params.push(exam_id);
    db.query(sql, params, callback);
};


/** history */
exports.insertExamHistory = function (uid, exam_id, answer, score, callback) {
    var sql = 'insert into exam_history (uid, exam_id, answer, score, create_time) values(?,?,?,?,?);';
    db.query(sql,[uid, exam_id, answer, score, new Date()], callback);
};

exports.queryExamHistorys = function (uid, start, pageSize, callback) {
    var sql = 'select h.*,p.name,p.description from exam_history h left join exam p on h.exam_id = p.id where h.uid = ? order by create_time desc ';
    var params = [];
    sql += ' limit ?,?;';
    params.push(uid);
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找试卷总数
exports.queryExamHistoryTotalCount = function (uid, callback) {
    var sql = 'select count(id) as count from exam_history where uid = ?;';
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
exports.getExamHistoryById = function (id, callback) {
    db.query("select h.*,p.name,p.description from exam_history h left join exam p on h.exam_id = p.id  where h.id = ?;", [id], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};

//根据id获取试卷
exports.getExamHistoryByUidEid = function (uid, eid, callback) {
    db.query("select h.*,p.name,p.description from exam_history h left join exam p on h.exam_id = p.id  where h.uid = ? and h.exam_id = ?;", [uid, eid], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};
