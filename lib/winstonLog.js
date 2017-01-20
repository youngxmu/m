var winston = require("winston");
var config = require("../config");
var dateFormat = require("./dateFormat.js");

winston.handleExceptions(new winston.transports.File({
    filename: config.winston.exceptionFile,
    json: true
}));
var winstonLogger = new (winston.Logger)({
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
            json: false,
            level: 'debug',
            timestamp:function(){
                return dateFormat.asString(new Date())
            }
        }),
        new winston.transports.DailyRotateFile({
            filename: config.winston.dailyRotateFile,
            json: false,
            level: 'debug',
            datePattern: '.yyyy-MM-dd',
            timestamp:function(){
                return dateFormat.asString(new Date())
            }
        })
    ]
});

winstonLogger.on('logging', function (transport, level, msg, meta) {
    // [msg] and [meta] have now been logged at [level] to [transport]
    //console.log('logging ok --> ',msg,meta,level);
});

winstonLogger.on('error', function (err) {
    console.log("winston logger error");
});


var loggers = {};

function Logger(flag) {
    this.id = (new Date()).getTime();
    this.flag = "[" + flag + "]";

};

Logger.prototype.info = function () {
    var aArguments = Array.prototype.slice.call(arguments);
    aArguments.push(this.flag);
    winstonLogger.info.apply(winstonLogger, aArguments);
};


exports.Logger = function (flag) {
    if (loggers[flag]) {

    }
    else {
        loggers[flag] = new Logger(flag);
    }
    console.log("get logger: ", loggers[flag].id);
    return loggers[flag];
};