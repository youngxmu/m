var db = require('../lib/db.js');
var logger = require('../lib/log.js').logger('uploadFileModel');

//保存上传记录
exports.createUploadFile = function (params, callback) {
    logger.info("保存上传后的文件信息到数据库", params);

    var now = new Date();

    //注意”key"不能直接写在sql里，要特殊字符处理
    db.query("insert into upload_file(hash,`key`,url,from_id,filepath,origin_file_name,origin_file_size,create_time) values(?,?,?,?,?,?,?,?)",
        [params.hash, params.key, params.url, params.from_id || 0, params.filepath || "", params.origin_file_name, params.origin_file_size ||"", now], function (err, reply) {
           if(err){
               logger.error("保存上传后的文件信息到数据库出错", err);
           }
            callback && callback(err, reply);
        });


};
