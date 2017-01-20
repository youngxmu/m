var logger = require("./lib/log.js").logger("route");
var config = require("./config");
var authRouter = require('./routes/authRouter.js');
var uploadRouter = require('./routes/uploadRouter.js');
var registerRouter = require('./routes/registerRouter.js');

var viewRouter = require('./routes/viewRouter.js');
var menuRouter = require('./routes/menuRouter.js');

/* index */
var indexRouter = require('./routes/index/indexRouter.js');
var indexResRouter = require('./routes/index/resRouter.js');
var indexInfoRouter = require('./routes/index/infoRouter.js');
var indexScienceRouter = require('./routes/index/scienceRouter.js');
var indexAboutRouter = require('./routes/index/aboutRouter.js');



/** user */
var userPaperRouter = require('./routes/user/paperRouter.js');
var userExamRouter = require('./routes/user/examRouter.js');

var userQuestionRouter = require('./routes/user/questionRouter.js');
var userArticleRouter = require('./routes/user/articleRouter.js');
var userResourceRouter = require('./routes/user/resourceRouter.js');

var userVoteRouter = require('./routes/user/voteRouter.js');
// var userIndexRouter = require('./routes/user/indexRouter.js');
var userExpertRouter = require('./routes/user/expertRouter.js');
var userJSLLSupportRouter = require('./routes/user/jsllSupportRouter.js');
var userJSJNSupportRouter = require('./routes/user/jsjnSupportRouter.js');
var userHBLLSupportRouter = require('./routes/user/hbllRouter.js');
var userMessageRouter = require('./routes/user/messageRouter.js');

/**admin*/
var adminIndexRouter = require('./routes/admin/indexRouter.js');
var adminInfoRouter = require('./routes/admin/infoRouter.js');
var adminResourceRouter = require('./routes/admin/resourceRouter.js');
var adminArticleRouter = require('./routes/admin/articleRouter.js');
var adminCheckRouter = require('./routes/admin/checkRouter.js');
var adminQuestionRouter = require('./routes/admin/questionRouter.js');
var adminPaperRouter = require('./routes/admin/paperRouter.js');
var adminUserRouter = require('./routes/admin/userRouter.js');
var adminTeacherRouter = require('./routes/admin/teacherRouter.js');
var adminExpertRouter = require('./routes/admin/expertRouter.js');

var adminVoteRouter = require('./routes/admin/voteRouter.js');

var adminJSLLRouter = require('./routes/admin/jsllRouter.js');
var adminJSJNRouter = require('./routes/admin/jsjnRouter.js');
var adminHBLLRouter = require('./routes/admin/hbllRouter.js');
var adminMessageRouter = require('./routes/admin/messageRouter.js');


module.exports = function (app) {
    app.use('/auth', authRouter);//登录
    
    app.use('/user', registerRouter);//通用文件上传
    app.use('/menu', menuRouter);//通用文件上传
    app.use('/view', viewRouter);//通用文件上传
    
    /***index start*/
    app.use('/index', indexRouter);
    app.use('/index/res', indexResRouter);
    app.use('/index/info', indexInfoRouter);
    app.use('/index/science', indexScienceRouter);
    app.use('/index/about', indexAboutRouter);
    
    /***index end*/



    app.use('/article', userArticleRouter);//通用文件上传
    app.use('/resource', userResourceRouter);//通用文件上传
    app.use('/expert', userExpertRouter);//通用文件上传
    
    app.use('/paper', userPaperRouter);
    app.use('/exam', userExamRouter);
    
    app.use('/question', userQuestionRouter);
    
    app.use('/jsll', userJSLLSupportRouter);
    app.use('/jsjn', userJSJNSupportRouter);
    app.use('/vote', userVoteRouter);
    app.use('/hbll', userHBLLSupportRouter);
    app.use('/message', userMessageRouter);

    app.use('/admin/index', adminIndexRouter);
    app.use('/admin/info', adminInfoRouter);
    app.use('/admin/article', adminArticleRouter);
    app.use('/admin/resource', adminResourceRouter);
    
    app.use('/admin/check', adminCheckRouter);
    app.use('/admin/user', adminUserRouter);
    app.use('/admin/question', adminQuestionRouter);
    app.use('/admin/paper', adminPaperRouter);
    app.use('/admin/expert', adminExpertRouter);
    app.use('/admin/vote', adminVoteRouter);

    app.use('/admin/jsll', adminJSLLRouter);
    app.use('/admin/jsjn', adminJSJNRouter);
    app.use('/admin/hbll', adminHBLLRouter);

    app.use('/admin/teacher', adminTeacherRouter);

    app.use('/admin/message', adminMessageRouter);

    
    

    app.use('/upload', uploadRouter);//通用文件上传
    app.get("/", function (req, res, next) {
        res.redirect("/index")
    });

};
