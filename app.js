var express = require('express');
var path = require('path');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var multiparty = require('multiparty');
var redisUtils = require('./lib/redisUtils.js')
var utils = require('./lib/utils.js')
var menuUtils = require('./lib/menuUtils.js')


var log4js = require('log4js');
var logger =  require('./lib/log.js').logger('app');
logger.setLevel('info');

var route = require('./route.js');
var config = require('./config');

var cookie = cookieParser(config.sessionSecret);
var app = express();
app.set('env', config.env);
app.set('port', config.port);
app.set('views', config.views);
app.set('view engine', config.viewEngine);
// app.use(log4js.connectLogger(logger, {
//     level: "auto"
// }));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser());
app.use(methodOverride());
app.use(cookie); //须在expressSession前使用cookieParser
var sessionStore = new expressSession.MemoryStore();
app.use(expressSession({
    secret: config.sessionSecret,
    key: 'expressId', //种到cookies里的标识
    store: sessionStore
}));
//app.use(csrf());
app.use(express.static(config.staticPath));

if(config.env!='devvv'){//开发环境不需要过滤



    var whitelist = config.whitelist;
    app.use(function(req, res, next) {//判断是否登录的中间件
        res.locals.currDate = utils.indexDate(new Date());
        res.locals.islogin = false;

// return next();

        var requestPath = req.path;//请求的uri
        var inWhitelist = false;
        for (var i in whitelist) {
            if (requestPath == whitelist[i]) {
                inWhitelist = true;
                break;
            }
        }




        var url = req.url;
        if(req.session){//如果存在session则继续
            res.locals.sid = req.session.id;
        }
        if(req.session &&  req.session.user){//如果存在session则继续
            res.locals.islogin = true;
            var name = req.session.user.name;
            if(!name){
                name = req.session.user.email;
            }
            res.locals.username = name;
        }
        if (inWhitelist || (url.indexOf('/index') != -1 && url.indexOf('/admin') == -1) || url.indexOf('/uploads') != -1 ) {//在白名单中，不需要过滤

            next();
        }else{
            if(req.session && req.session.user && url.indexOf('/admin') == -1){//如果存在session则继续
                res.locals.islogin = true;
                var name = req.session.user.name;
                if(!name){
                    name = req.session.user.email;
                }
                res.locals.username = name;
                var sid = req.session.id;
                var uid = req.session.user.id;
                redisUtils.setWithExpire(sid, uid, 15 * 60, function(){
                });
                next();
            }else if(req.session && req.session.admin && url.indexOf('/admin') != -1){//如果存在session则继续
                res.locals.islogin = true;
                next();
            }else{
                if(url.indexOf('login') != -1){
                    next();
                }else{
                    if(url.indexOf('/admin/') != -1){
                        res.redirect("/auth/admin/login");    
                    }else{
                        // var title = "国防教育资源库";
                        // if(url.indexOf('jsll') != -1){
                        //   title = '军事理论研究';
                        // }
                        // if(url.indexOf('jsjn') != -1){
                        //   title = '军事技能学习';
                        // }
                        // if(url.indexOf('jsll') != -1){
                        //   title = '军事理论研究';
                        // }
                        // if(url.indexOf('paper') != -1){
                        //   title = '理论学习考试';
                        // }
                        // if(url.indexOf('hbll') != -1){
                        //   title = '国防后备力量';
                        // }
                        // if(url.indexOf('vote') != -1){
                        //   title = '国防教育测评';
                        // }
                        // if(url.indexOf('expert') != -1){
                        //   title = '国防师资力量';
                        // }
                        // res.locals.systitle = title;
                        if(url.indexOf('/view/') != -1){
                            return next();//res.redirect("/resource/index");
                        }
                        if(url.indexOf('/resource/') != -1 || url.indexOf('/menu/') != -1){
                            return next();//res.redirect("/resource/index");
                        }
                        if(url.indexOf('/vote/') != -1 || url.indexOf('/article/') != -1){
                            return next();
                        }
                        if(url.indexOf('/paper/') != -1){
                            return next();
                            // return res.redirect("/paper/index");
                        }
                        if(url.indexOf('/exam/') != -1){
                            return next();
                            // return res.redirect("/paper/index");
                        }
                        if(url.indexOf('/question/') != -1){
                            return next();
                        }
                        
                        if(url.indexOf('/jsll/') != -1){
                            return next();
                            return res.redirect("/jsll/index");
                        }
                        if(url.indexOf('/jsjn/') != -1){
                            return next();
                            return res.redirect("/jsjn/index");
                        }
                        
                        if(url.indexOf('/hbll/') != -1){
                            return next();
                            return res.redirect("/hbll/index");
                        }
                        if(url.indexOf('/vote/') != -1){
                            return next();
                            return res.redirect("/vote/index");
                        }
                        if(url.indexOf('/expert/') != -1){
                            return next();
                            return res.redirect("/expert/index");
                        }
                        res.redirect("/auth/user/login");
                    }    
                }
            }
        }
    });
}


app.use(function(req, res, next) {//判断是否是上传图片的中间件
    if (req.method === 'POST' && req.headers['content-type'] &&
        req.headers['content-type'].indexOf("multipart/form-data") !== -1) {

        try {
            var form = new multiparty.Form({
                autoFields: true,
                autoFiles: true,
                maxFilesSize: 1024 * 1024 * 20,
                uploadDir: config.uploadDir
            }); // 20M
            form.parse(req, function (err, fields, files) {
                if (err) {
                    logger.error("上传文件时，form parse出错",err);
                    return res.render("error",{
                        msg: "上传文件form.parse解析过程出错"
                    });
                }
                req.files = files;
                req.fields = fields;
                next();
            });
        }catch(e){
            console.log(e);
            logger.error("上传过程出错",e);
            return res.render("error",{
                msg: "上传文件生成form解析过程出错"
            });
        }
    } else {
        next();
    }
});


route(app); //加载routes

//404错，即无匹配请求地址
app.use(function(req, res, next) {
    if (!req.xhr) {
        if(req.path.indexOf('js/lib/jquery.min.map') != -1){
            logger.error('common 404');
            res.status(404);
            res.render('error', {
                msg: "404 未找到"
            });
        }else{
                
        }
        
    } else { //这里遇到xhr的404错误,在返回数据中指明
        logger.error('xhr 404');
        res.status(404);
        res.json({
            success: false,
            status: 404,
            msg: '404错误'
        });
    }
});

//记录错误日志
app.use(function(err, req, res, next) {
    var status = err.status || 500;
    logger.error('【error】', 'status:', status, 'message:', err.message || '');
    logger.error('【stack】\n ', err.stack || '');
    next(err);
});

//处理错误，返回响应
app.use(function(err, req, res, next) {
    var status = err.status || 500;
    if (!req.xhr) {
        //logger.error('common other error');
        res.status(status);
        res.render('error', {
            success: false,
            status: status,
            msg: '500错误'
        });
    } else { //xhr的内部调用的错误会到达这个分支
        //logger.error('xhr other error');
        res.status(status);
        res.json({
            success: false,
            status: status,
            msg: 'xhr发生错误'
        });
    }
    return;
});


var server = require('http').Server(app);
server.listen(app.get('port'), function() {
    console.log('Server listening on port ' + server.address().port, ', env is ' + app.get('env'));
});

process.on('uncaughtException', function(err) {
    console.log('Holy shit!!!!! Fatal Errors!!!!!!! ' + err);
});


menuUtils.refreshMenu();

var sysUtils = require('./lib/sysUtils.js');
sysUtils.getDBIndexModules();