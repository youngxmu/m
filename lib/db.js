var mysql = require("mysql");
var config = require("../config");
var logger =  require('./log.js').logger('db');

var pool = mysql.createPool({
	connectionLimit: 15,
	host: config.host,
	// port :3307,
	user: config.user,
	password: config.password,
	database: config.database,
	supportBigNumbers: true //dealing with big numbers as a string
	//debug: true
});

exports.query = function(sql, params, callback) {
	// logger.error("进入query：", sql, params);
	pool.getConnection(function(err, connection) {
		logger.info("尝试拿到连接", err==null);
		if (err) {
			try{
				connection.release();
			}catch(e){
				logger.error("拿连接出错，尝试释放出错",err, connection);
			}
			callback(err);
		} else {
			logger.info('connected as id ' + connection.threadId);
			connection.query(sql, params, function(err, data) {
				logger.info('connect will be released ' + connection.threadId);
				connection.release();

				if (err) {
					logger.error(err);
				}
				callback(err, data);
			});
		}
	});
};