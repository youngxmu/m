/**
 * 模特标签管理
 */
var db = require('../lib/db.js');
var logger = require("../lib/log.js").logger("tagModel");
var commonUtils = require("../lib/utils.js");


//获取所有标签
exports.getTags = function (callback) {
    db.query("select * from tag", [], callback);
};

//获取模特的的所有被打上的标签
exports.getTagsOfModel = function (modelId, callback) {
    db.query("select l.tag_id as tag_id, l.create_time as create_time, t.name as tag_name from link_model_tag l left join tag t on l.tag_id=t.id where l.model_id=?", [modelId], callback);
};

//删除模特的某个标签
exports.deleteTagOfModel = function (modelId, tagId, callback) {
    db.query("delete from link_model_tag where model_id = ? and tag_id = ?;", [modelId, tagId], callback);
};

//删除模特的所有标签
exports.deleteTagsOfModel = function (modelId, callback) {
    db.query("delete from link_model_tag where model_id = ?", [modelId], callback);
};



//新建模特标签
exports.insertTagOfModel = function (modelId, tagId, callback) {
    db.query("insert into link_model_tag(model_id,tag_id,create_time) values(?,?,?)", [modelId, tagId, new Date()], callback);
};


//修改标签
exports.updateTag = function (tagId, name, desc, callback) {
    db.query("update tag set name= ?, `desc` = ? where id = ?", [name, desc, tagId], callback);
};

//新建标签
exports.insertTag = function (name, desc, callback) {
    db.query("insert into tag(name, `desc`) values(?,?)", [name, desc], callback);
};