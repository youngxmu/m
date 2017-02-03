var db = require('../lib/db.js');

//查找管理员
exports.query=function(username, passwd, callback){
	db.query("select * from admin where name = ? and password = ?;", [username, passwd], callback);
};



exports.insert = function (name, password, username, tel, type, status, callback) {
    var sql = 'insert into admin ';
    sql += '(name, password, username, tel, type, status, create_time) ';
    sql += 'values(?,?,?,?,?,?,?);';
    var params = [];

    db.query(sql, [name, password, username, tel, type, status, new Date()], callback);
};

exports.update = function (id, password, username, tel, type, callback) {
	console.log(username);
	var sql = 'update admin set create_time = create_time ';
	var params = [];
	if(password){
		sql += ', password = ? ';
		params.push(password);
	}
	if(username){
		sql += ', username = ? ';
		params.push(username);
	}
	if(tel){
		sql += ', tel = ? ';
		params.push(tel);
	}
	if(type){
		sql += ', type = ? ';
		params.push(type);
	}
	sql += ' where id = ?;';
	params.push(id);
    db.query(sql, params , callback);
}

exports.del = function (id, callback) {
	var sql = 'delete from admin where id = ?';
	var params = [];
	params.push(id);
    db.query(sql, params , callback);
}


//根据“是否虚拟”“创建来源”查找宅男列表
exports.queryTeacherList = function (username, tel, start, pageSize, callback) {
	var params = [];
	var sql = 'select * from admin where 1 = 1 ';
	if(username){
		sql += ' username like %' + username + '% ';
	}
	if(tel){
		sql += ' tel like %' + tel + '% ';
	}
	sql += ' order by id asc limit ?,?;';
	params.push(start);
	params.push(pageSize);
    db.query(sql,params, callback);
};

//根据“是否虚拟”“创建来源”查找宅男总数
exports.getTeacherTotalCount = function (username, tel, callback) {
	var sql = 'select count(id) as count from admin where 1 = 1 ';
	if(username){
		sql += ' username like %' + username + '% ';
	}
	if(tel){
		sql += ' tel like %' + tel + '% ';
	}
	sql += ';';
    db.query(sql,[],function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找总数出错", err);
            callback(0);
        }
    });
};
