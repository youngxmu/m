var path = require('path');

module.exports = {
	port: 9000,
	viewEngine: 'ejs',

	views: path.resolve(__dirname, '..', 'views'),
	staticPath: path.resolve(__dirname, '..', 'public'),
	uploadDir: '/wmdata/data/tmp/weimo_admin_prod',//注意：要首先建立该文件夹，并做好权限

	env: 'production',
	logfile: '/wmdata/logs/weimo_admin_prod/access.log',

	sessionSecret: 'session_secret_random_seed',

	//mysql config
	host: "10.51.84.215",
	user: "weimo_prod",
	password: "5432423dfsaff",
	database: "weimo_prod",


	//redis config
	"redis": {"address": "127.0.0.1", "port": "6379", "passwd": "mokaredispass!@$%67493jf3443"},
	"redis_tel_validate_prefix": "tel_val:",//用于注册时临时存在与注册手机匹配的随机数的key前缀
	"redis_session_prefix": "user_session:",//redis里用于保存用户(用户/模特)Session的key的前缀
	"token_secret": "generated_token_secret",//用于生成“授权token”的secret
	"testValidCode" : true,

	//不需要过滤是否登陆状态的白名单
	"whitelist": [
		"/",
		"/out/insertModelFromOut",
		"/auth/login",
		"/version"
	],


	//七牛配置
	qiniu: {
		ak: "gWR1Ww60qmiFuu9hao1hRdKrDkcNxE7x-l11cVDV",
		sk: "t-sYZ4Cf5x1V97cmVbAeqIokK8JwkfQBcSYYea7Q",
		bucket: "moka",
		domain: "7xidaa.com2.z0.glb.qiniucdn.com"
	},

	sms:{
		apikey:"51c1bb1657d7ecc16f6e26b2a640281d"
	},

	easemob:{
		org_name:"feton",
		app_name:"weimo4prod",
		client_id: "YXA6iJ7sUNewEeSB5SP4u_KoHA",
		client_secret: "YXA60tJSQpBCOeEUkARqhR-YCyAeqeQ"
	},

	jpush:{
		AppKey:"e92c1d6d2bbeb7d03032e875",
		MasterSecret:"2453db2990def69af795558c",

		systemAlbum:"prod_system_album" //用于系统福利的推送key
	},

	md5Salt: "moka_salt", //在接到模特、宅男注册时的passwd后，以此作为盐生成数据库中的密码


	accessKey:"prod_sdf34%$fsf43gfdrwer3547657werewr" //内部其他系统调用本系统API时必须带上这个key
};