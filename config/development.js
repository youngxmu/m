var path = require('path');

module.exports = {
	port: 8200,
	viewEngine: 'ejs',

	views: path.resolve(__dirname, '..', 'views'),
	staticPath: path.resolve(__dirname, '..', 'public'),
	uploadDir: path.resolve(__dirname, '..', 'public/uploads'),
	uploadFileDir: path.resolve(__dirname, '..', 'public/uploads/file'),
	redirectPath : '/',
	// imgHost: 'http://192.168.2.231:8200',
	// host: 'http://192.168.2.231:8200',
	imgHost: 'http://localhost:8200',
	sysHost: 'http://localhost:8200',
	env: 'dev',
	logfile: path.resolve(__dirname, '..', 'logs/access.log'),
	sessionSecret: 'session_secret_random_seed',

	//mysql config
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "moka",
	enableDBLog: true,

	winston:{
		exceptionFile:path.resolve(__dirname, '..', 'logs/exceptions.log'),
		dailyRotateFile:path.resolve(__dirname, '..', 'logs/daily.log')
	},


	//redis config
	"redis": {"address": "127.0.0.1", "port": "6379", "passwd": "Hs1JlTXOGsDRtq8UH"},
	"redis_tel_validate_prefix": "tel_val:",//用于注册时临时存在与注册手机匹配的随机数的key前缀
	"redis_session_prefix": "user_session:",//redis里用于保存用户(用户/模特)Session的key的前缀
	"token_secret": "generated_token_secret",//用于生成“授权token”的secret
	"testValidCode" : true,

	//不需要过滤是否登陆状态的白名单
	"whitelist": [
		"/",
		"/index",
		"/index/news",
		"/index/gfjy",
		"/index/jsll",
		"/index/jsjn",
		"/index/llks",
		"/upload/img",
		"/upload/file",
		"/resource/list",
		
		"/out/insertModelFromOut",
		"/auth/login",
		"/auth/admin/login",
		"/auth/user/login",
		"/user/register",

		"/article/queryArticleByMenu",
		"/version"
	],

	md5Salt: "moka_salt", //在接到模特、宅男注册时的passwd后，以此作为盐生成数据库中的密码


	accessKey:"dev_abfeufiu$%fee23431232IJ" //内部其他系统调用本系统API时必须带上这个key
};