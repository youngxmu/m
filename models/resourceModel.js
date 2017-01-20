var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("resourceModel");
var commonUtils = require("../lib/utils.js");

//user & common
exports.queryResources = function (status, start, pageSize, callback) {
    var sql = 'select * from resource where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }

    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.queryResourceTotalCount = function (status, callback) {
    var sql = 'select count(id) as count from resource where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }

    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            callback(0);
        }
    });
};

exports.queryResourceById = function (resourceId, callback) {
    db.query("select * from resource where id = ? and status = 1;", [resourceId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};

exports.queryResourceByTitle = function (title, type, start, pageSize, callback) {
    var params = [];
    var sql = 'select * from resource where 1 = 1 ';
    if(title){
        var keyArr = title.split(' ');
        if(keyArr.length > 1){
            sql += ' and ( ';
            for(var index in keyArr){
                var key  = keyArr[index];
                if(index == 0){
                    sql += ' title like "%' + key + '%" ';        
                }else{
                    sql += ' or title like "%' + key + '%" ';    
                }
            }
            sql += ' ) ';
        }else{
            sql += ' and title like "%' + title + '%" ';    
        }
    }
    if(type){
        sql += ' and content_type in (?) ';
        params.push(type);
    }
    sql += 'order by create_time desc limit ?,?;';
    console.log(sql);
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.queryResourceByTitleTotalCount = function (title, type, callback) {
    var params = [];
    var sql = 'select count(id) as count from resource where 1 = 1 ';
    if(title){
        var keyArr = title.split(' ');
        if(keyArr.length > 1){
            sql += ' and ( ';
            for(var index in keyArr){
                var key  = keyArr[index];
                if(index == 0){
                    sql += ' title like "%' + key + '%" ';        
                }else{
                    sql += ' or title like "%' + key + '%" ';    
                }
            }
            sql += ' ) ';
        }else{
            sql += ' and title like "%' + title + '%" ';    
        }
    }
    if(type){
        sql += ' and content_type in (?) ';
        params.push(type);
    }
    sql += ';';
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};

//admin
//根据id获取文章
exports.getResourceById = function (resourceId, callback) {
    db.query("select * from resource where id = ?;", [resourceId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};
exports.insertResource = function (res_id,sys_type,title,content_type, callback) {
    var sql = 'insert into resource (res_id,sys_type,title,content_type, create_time) ';
        sql += 'values(?,?,?,?,?);';
    db.query(sql, [res_id,sys_type,title,content_type, new Date()],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改文章个人信息

exports.updateResource = function (id, res_id,sys_type,title,content_type , callback) {
    var sql = 'update resource set res_id=?, sys_type=?, title=?, content_type=?, create_time = ? ';
    var params = [];
    params.push(res_id);
    params.push(sys_type);
    params.push(title);
    params.push(content_type);
    params.push(new Date());
    sql += ' where id = ?;';
    params.push(id);
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("修改文章出错", err);
            callback(err);
        }
    });
};

exports.delResource = function (id, callback) {
    var sql = 'delete from resource ';
    var params = [];
    sql += ' where id = ?;';
    params.push(id);
    db.query(sql, params, function (err, result) {
        if (!err) {
            callback(null);
        } else {
            logger.error("删除文章出错", err);
            callback(err);
        }
    });
};




exports.queryResourceByModule = function (module, type, start, pageSize, callback) {
    var params = [];
    var sql = 'select r.*, 0 as rate from resource r where 1 = 1 ';
    if(module.upkeywords){
        var uparr = module.upkeywords.split(',');
        var length = uparr.length;
        if(length > 0){
            sql = 'select r.*, ';
            sql += '(0';
            for(var i=0;i<length;i++){
                sql += '+(CASE WHEN title LIKE "%'+ uparr[i] +'%" THEN '+ (length-i) +' ELSE 0 END) ';    
            }
            sql += ') as rate ';
            sql += 'from resource r where 1 = 1 ';
        }
    }
    
    if(module){
        // module.keywords = module.keywords.replace(/,/g,' ');
        var keyArr = module.keywords.split(',');
        if(keyArr.length > 1){
            sql += ' and ( ';
            for(var index in keyArr){
                var key  = keyArr[index];
                if(index == 0){
                    sql += ' title like "%' + key + '%" ';        
                }else{
                    sql += ' or title like "%' + key + '%" ';    
                }
            }
            sql += ' ) ';
        }else{
            sql += ' and title like "%' + module.keywords + '%" ';    
        }
    }
    if(type){
        sql += ' and content_type in (?) ';
        params.push(type);
    }
    sql += 'order by rate desc, create_time desc limit ?,?;';
    console.log(sql);
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.queryResourceByModuleTotalCount = function (module, type, callback) {
    var params = [];
    var sql = 'select count(id) as count from resource where 1 = 1 ';
     if(module){
        var keyArr = module.keywords.split(',');
        if(keyArr.length > 1){
            sql += ' and ( ';
            for(var index in keyArr){
                var key  = keyArr[index];
                if(index == 0){
                    sql += ' title like "%' + key + '%" ';        
                }else{
                    sql += ' or title like "%' + key + '%" ';    
                }
            }
            sql += ' ) ';
        }else{
            sql += ' and title like "%' + module.keywords + '%" ';    
        }
    }
    if(type){
        sql += ' and content_type in (?) ';
        params.push(type);
    }
    sql += ';';
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};



exports.updateIndexNo = function (menus, callback) {
    var params = [];
    var sql = 'update resource set index_no = case ';
    for(var index in menus){
        sql += ' when id = ? then ? ';
        var menu = menus[index];
        params.push(menu.id);
        params.push(menu.index);
    }
    sql += ' end;';
    db.query(sql, params, callback);
};