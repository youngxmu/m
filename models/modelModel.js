var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("modelModel");
var commonUtils = require("../lib/utils.js");
var easemobUtils = require("../lib/easemobUtils.js");

//根据“是否虚拟”“创建来源”查找模特列表
exports.queryModelList = function (isVirtual, createFrom, start, pageSize, callback) {
    var sql = 'select * from model where 1=1 ';
    var params = [];
    if (isVirtual != -1) {
        sql += ' and is_virtual=? ';
        params.push(isVirtual);
    }
    if (createFrom != -1) {
         sql += ' and create_from=? ';
         params.push(createFrom);
    }
    sql += ' order by create_time desc limit ?,?;';
    params.push(start);
    params.push(pageSize);
    db.query(sql, params, callback);
};

//根据“是否虚拟”“创建来源”查找模特总数
exports.getModelTotalCount = function (isVirtual, createFrom, callback) {
    var sql = 'select count(id) as count from model where 1=1 ';
    var params = [];
    if (isVirtual != -1) {
        sql += ' and is_virtual=? ';
        params.push(isVirtual);
    }
    if (createFrom != -1) {
         sql += ' and create_from=? ';
         params.push(createFrom);
    }
   
    db.query(sql, params, function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            logger.error("查找模特总数出错", err);
            callback(0);
        }
    });
};

//根据id查询模特
exports.queryModelById = function (modelId, callback) {
    db.query("select * from model where id=? limit 1", [modelId], callback);
};


//根据模特姓名模糊查询模特
exports.queryModelByName = function (name, callback) {
    db.query('select * from model where name like "%' + name + '%" order by create_time desc',
        [], callback);
};

//根据模特手机精确查询模特
exports.queryModelByTel = function (tel, callback) {
    db.query("select * from model where tel =?", [tel], callback);
};


//新建模特，注意这里的参数password应该与手机端的加密方式一样，目前是md5("真实密码","-weimo")
exports.insertModel = function (tel, name, password, birth, bwh, cup, height, inviteId, jifen, isVirtual, profile, callback) {
    if (!inviteId) {
        inviteId = 0;
    }

    var imUser = "m_" + tel;
    //模特以"m_"为环信用户前缀
    var imPasswd = "default_passwd";
    try {
        imPasswd = commonUtils.md5(password, "easemob_salt");//与moka_mobile项目统一这个salt
    } catch (e) {
    }

    db.query("insert into model (tel,name,passwd,birthday,bwh,cup,height,is_virtual,create_from, invite_id,jifen,profile, im_user,im_passwd," +
        "create_time) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
        [tel, name, password, birth, bwh, cup, height, isVirtual, 1, inviteId, jifen, profile, imUser, imPasswd, new Date()],
        function (err, result) {
            if (!err) {
                //在环信上注册一个对应用户 start
                easemobUtils.registerUser(imUser, imPasswd);
                //在环信上注册一个对应用户 stop
            }
            callback(err, result);
        });
};

//编辑、修改模特个人信息
exports.updateModel = function (modelId, tel, name, password, birthday, bwh, cup, height, jifen, profile, callback) {
    console.log(arguments);
    db.query("update model set tel=?,name=?,passwd=?,birthday=?,bwh=?,cup=?,height=?,jifen=?,profile=?, update_time=? where id=?",
        [tel, name, password, birthday, bwh, cup, height, jifen, profile, new Date(), modelId], callback);
};


//获取当前最大的“批量生成模特”过程中产生的moka_id
exports.queryMaxMokaIdForOut = function (callback) {
    db.query("select max(moka_id) as max_moka_id from model where moka_id>=20000 and moka_id<=29999 limit 1", [],callback);
};


//获取当前最大的“审核模特”过程中产生的moka_id
exports.queryMaxMokaIdForCheck = function (callback) {
    db.query("select max(moka_id) as max_moka_id from model where moka_id>=30000 and moka_id<=39999 limit 1",[], callback);
};

//外部java系统调用新建模特，注意这里的参数password应该与手机端的加密方式一样，目前是md5("真实密码","-weimo")
exports.insertModelFromOut = function (tel, name, password, birth, bwh, cup, height, inviteId, jifen, isVirtual, profile, mokaId, status, operator, createTime, callback) {
    if (!inviteId) {
        inviteId = 0;
    }

    var imUser = "m_" + tel;
    //模特以"m_"为环信用户前缀
    var imPasswd = "default_passwd";
    try {
        imPasswd = commonUtils.md5(password, "easemob_salt");//与moka_mobile项目统一这个salt
    } catch (e) {
    }

    if (!createTime) {
        createTime = new Date()
    };

    db.query("insert into model (tel,name,passwd,birthday,bwh,cup,height,is_virtual,create_from, invite_id,jifen,profile, im_user,im_passwd," +
        "create_time,moka_id,status,operator) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);",
        [tel, name, password, birth, bwh, cup, height, isVirtual, 1, inviteId, jifen, profile, imUser, imPasswd, createTime, mokaId, status, operator],
        function (err, result) {
            if (!err) {
                //在环信上注册一个对应用户 start
                easemobUtils.registerUser(imUser, imPasswd);
                //在环信上注册一个对应用户 stop
            }
            callback(err, result);
        });
};


//检查模特是否有moka_id，没有的话，初始化为newMokaId
exports.updateMokaId = function (modelId, newMokaId, callback) {
    db.query("update model set moka_id=if(moka_id is not null, moka_id, ?) where id=?;", [newMokaId, modelId], callback);
};



//按标签查找模特
exports.queryModelListByTag = function (start, pageSize, tagId, callback) {
    db.query("select m.id,m.tel,m.name,m.level,m.birthday,m.bwh,m.cup,m.height,m.moka_id,m.profile,m.create_time,m.status from link_model_tag l " +
        " left join model m on l.model_id=m.id where l.tag_id=? and m.status = 1  order by l.create_time desc limit ?,?;",
        [tagId, start, pageSize], callback);
};

//按标签查找模特总数
exports.getModelTotalCountByTag = function (tagId, callback) {
    db.query("select count(m.id) as count from link_model_tag l left join model m on l.model_id=m.id where l.tag_id=? and m.status = 1",[tagId], function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            console.log("按标签查找模特总数出错", err);
            callback(0);
        }
    });
};

//按标签查找模特
exports.queryModelListWithoutTag = function (start, pageSize, tagId, callback) {
    var sql = 'select m.id,m.tel,m.name,m.level,m.birthday,m.bwh,m.cup,m.height,m.moka_id,m.profile,m.create_time,m.status ';
    sql += 'from model m ';
    sql += 'where m.status = 1 and m.id not in(select l.model_id from link_model_tag l where l.tag_id = ?) ';
    sql += 'order by m.create_time desc limit ?,?;';

    db.query(sql, [tagId, start, pageSize], callback);
};

//按标签查找模特总数
exports.getModelTotalCountWithoutTag = function (tagId, callback) {
    var sql = 'select count(m.id) as count from model m ';
    sql += 'where m.status = 1 and m.id not in(select l.model_id from link_model_tag l where l.tag_id = ?) ';
    db.query(sql ,[tagId], function (err, result) {
        if (!err && result && result[0]) {
            callback(result[0].count);
        } else {
            console.log("按标签查找模特总数出错", err);
            callback(0);
        }
    });
};

exports.updateModelInviteId = function (inviteId, modelId, callback) {
    db.query("update model set invite_id=? where id=? and invite_id = 0;", [inviteId, modelId], callback);
};