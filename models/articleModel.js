var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("articleModel");
var commonUtils = require("../lib/utils.js");
var config = require("../config");

exports.queryArticles = function (status, menu_id, start, pageSize, callback) {
    var sql = 'select * from article where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }

    if(menu_id){
        sql += ' and menu_id in ('+ menu_id +') ';    
    }
    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找文章总数
exports.queryArticleTotalCount = function (status, menu_id, callback) {
    var sql = 'select count(id) as count from article where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }

    if(menu_id){
        sql += ' and menu_id in ('+ menu_id +') ';    
    }
   
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};

exports.getArticleList = function (status, start, pageSize, callback) {
    var sql = 'select * from article where 1=1 ';
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

//根据“是否虚拟”“创建来源”查找文章总数
exports.getArticleTotalCount = function (status, callback) {
    var sql = 'select count(id) as count from article where 1=1 ';
    var params = [];
    if (status || status == 0) {
        sql += ' and status = ? ';
        params.push(status);
    }
   
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
        }
    });
};


//根据id获取文章
exports.getArticleById = function (articleId, callback) {
    db.query("select * from article where id = ?;", [articleId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};


//根据id查询文章
exports.queryArticleById = function (articleId, callback) {
    db.query("select * from article where id = ? and status = 1;", [articleId], function (err, result) {
        if(!err && result && result[0]){
            callback(err, result[0]);
        }else{
            callback(err);    
        }
    });
};

exports.queryArticleByTitle = function (title, start, pageSize, callback) {
    var params = [];
    var sql = 'select * from article where 1 = 1 ';
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
    sql += 'order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.queryArticleByTitleTotalCount = function (title, callback) {
    var params = [];
    var sql = 'select count(id) as count from article where 1 = 1 ';
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



exports.insertArticle = function (title, author, content, status, menu_id, author_id, file_name, type, description, callback) {
    var sql = 'insert into article ( ';
        sql += 'title, author, content, status, create_time, update_time, menu_id, author_id, file_name, type, description) ';
        sql += 'values(?,?,?,?,?,?,?,?,?,?,?);';
    db.query(sql,
        [title, author, content, status , new Date(), new Date(), menu_id, author_id, file_name, type,description],
        function (err, result) {
            callback(err, result);
        }
    );
};

//编辑、修改文章个人信息

exports.updateArticle = function (id, title, author, content, status, menu_id, author_id, file_name, type, description, callback) {
    var sql = 'update article set title=?,author=?,content=?';
    var params = [];
    params.push(title);
    params.push(author);
    params.push(content);
    if (status != -1) {
        sql += ',status = ? ';
        params.push(status);
    }
    sql += ',update_time = ? ';
    params.push(new Date());
    sql += ',menu_id = ? ';
    params.push(menu_id);
    if(file_name){
        file_name = file_name.replace(config.imgHost + '/uploads/', '');
        sql += ',file_name = ? ';
        params.push(file_name);    
    }
    
    sql += ',type = ? ';
    params.push(type);
    sql += ',description = ? ';
    params.push(description);
    sql += ' where id = ?;';
    params.push(id);


    db.query(sql, params, function (err, result) {
        callback(err);
    });
};

exports.delArticle = function (id, callback) {
    var sql = 'update article set status = 0 ';
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


exports.getArticleByMenu = function (menu_id, start, pageSize, callback) {
    var sql = 'select * from article where 1=1 ';
    var params = [];
    sql += ' and status = 1 ';
    if(menu_id){
        sql += ' and menu_id in ('+ menu_id +') ';    
    }
    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

exports.getArticleByMenuTotalCount = function (menu_id, callback) {
    var sql = 'select count(id) as count from article where 1=1 ';
    var params = [];
    sql += ' and status = 1 ';
    if(menu_id){
        sql += ' and menu_id in ('+ menu_id +') ';    
    }
   
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找文章总数出错", err);
            callback(0);
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

exports.updateResource = function (res_id, sys_type, title, content_type , callback) {
    var sql = 'update resource set sys_type=?, title=?, content_type=?, create_time = ? ';
    var params = [];
    params.push(sys_type);
    params.push(title);
    params.push(content_type);
    params.push(new Date());
    sql += ' where res_id = ?;';
    params.push(res_id);
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

exports.updateViewName = function (id, view_name , callback) {
    var sql = 'update article set view_name=? ';
    var params = [];
    sql += ' where id = ?;';
    params.push(view_name);
    params.push(id);
    db.query(sql, params, function (err, result) {
        if (!err ) {
            callback(null);
        } else {
            logger.error("修改文章出错", err);
            callback(err);
        }
    });
};