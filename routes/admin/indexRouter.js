var express = require('express');
var config = require("../../config");
var async = require('async');
var commonUtils = require("../../lib/utils");
var sysUtils = require('../../lib/sysUtils.js');
var newsModel = require("../../models/newsModel");
var indexModel = require("../../models/indexModel");
var logger = require("../../lib/log.js").logger("indexRouter");

var router = express.Router();

router.post('/setup', function (req, res, next) {
    var mid = req.body.mid;
    var res_id = req.body.res_id;

    indexModel.getUp(mid, function (err, result) {
        if (err || !result || result.length == 0) {
            logger.error("置顶出错", err);
            res.json({
                success: false,
                msg: "置顶出错"
            });
        } else {
            var aids = result[0].aids;
            var aidArr = [];
            if(aids && aids.length > 0){
                aidArr = aids.split(',');
            }
            if(aidArr.length >=7 ){
                return res.json({
                    success: false,
                    msg: "最多只能置顶7个"
                });
            }
            aidArr.push(res_id);
            indexModel.updateUp(mid, aidArr.join(','), function (err, result) {
                if (err) {
                    logger.error("置顶出错", err);
                    res.json({
                        success: false,
                        msg: "置顶出错"
                    });
                } else {
                    res.json({
                        success: true,
                        msg: "置顶成功"
                    });
                }
            });
        }
    });
});

//根据”创建渠道“和”是否虚拟“查询文章
router.post('/setdown', function (req, res, next) {
    var mid = req.body.mid;
    var res_id = req.body.res_id;
    indexModel.getUp(mid, function (err, result) {
        if (err || !result || result.length == 0) {
            res.json({
                success: false,
                msg: "取消置顶出错"
            });
        } else {
            var aids = result[0].aids;
            var aidArr = aids.split(',');
            if(aidArr.length == 0 ){
                return res.json({
                    success: false,
                    msg: "出错啦，请刷新页面"
                });
            }
            var arr = [];
            for(var index in aidArr){
                if(aidArr[index] != res_id){
                    arr.push(aidArr[index]);
                }
            }
            indexModel.updateUp(mid, arr.join(','), function (err, result) {
                if (err) {
                    logger.error("取消置顶出错", err);
                    res.json({
                        success: false,
                        msg: "取消置顶出错"
                    });
                } else {
                    res.json({
                        success: true,
                        msg: "取消置顶成功"
                    });
                }
            });
        }
    });
});


router.get('', function (req, res, next) {
    res.render('admin/index/index');
});

router.get('/module', function (req, res, next) {
    res.render('admin/index/module');
});

router.get('/news', function (req, res, next) {
    res.render('admin/index/news');
});

router.post('/news', function (req, res, next) {
    newsModel.queryNewsList(function(err, results){
    	if(err){
    		return res.json({
    			success : false
    		});
    	}else{
    		return res.json({
    			success : true,
    			list : results
    		});
    	}
    });
});

router.post('/setnews', function (req, res, next) {
	var newsStr = req.body.newsStr;
	var newslist = JSON.parse(newsStr);
	newsModel.delAllNews(function(err, results){
    	if(err){
    		return res.json({
    			success : false
    		});
    	}else{
    		async.each(newslist,
				function(news, callback){
					newsModel.insertNews(news.title, news.link, news.pic_url, news.index, function (err, result) {
	                    callback(err);
	                });
				},
				function(err){
					if (err) {//任何一个err都会停止执行其他
	                    res.json({
	                        success: false,
	                        msg: "更新失败"
	                    });
	                } else {
	                    res.json({
	                        success: true
	                    });
	                }
				}
			);
    	}
    });
});

router.post('/modules', function (req, res, next) {
    indexModel.queryModules(function(err, results){
    	if(err){
    		return res.json({
    			success : false
    		});
    	}else{
    		return res.json({
    			success : true,
    			list : results
    		});
    	}
    });
});
router.post('/updateModule', function (req, res, next) {
	var id = req.body.id;
	var keywords = req.body.keywords;
    var type = req.body.type;
    indexModel.updateModule(id, keywords, type, function(err, results){
    	if(err){
    		return res.json({
    			success : false
    		});
    	}else{
            sysUtils.getDBIndexModules();
    		return res.json({
    			success : true,
    			list : results
    		});
    	}
    });
});

router.post('/info/view/:mid', function (req, res, next) {
    var mid = req.params.mid;
    indexModel.queryInfoById(mid, function(err, result){
        if(err || result.length == 0){
            res.json({
                success : false,
                msg : '不存在'
            });
        }else{
            res.json({
                success : true,
                data : result[0]
            });
        }
    });
});

router.post('/info/save', function (req, res, next) {
    var mid = req.body.mid;
    var content = req.body.content;
    indexModel.updateInfo(mid, content, function(err){
        if(err){
            res.json({
                success : false,
                msg : '更新失败'
            });
        }else{
            res.json({
                success : true,
                msg : '更新成功'
            });
        }
    });
});

router.post('/news/save', function (req, res, next) {
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var cover = req.body.cover;
    if(!id){
        newsModel.insert(title, content, cover, function(err){
            if(err){
                res.json({
                    success : false,
                    msg : '更新失败'
                });
            }else{
                res.json({
                    success : true,
                    msg : '更新成功'
                });
            }
        });
    }else{
        newsModel.update(id, title, content, cover, function(err){
            if(err){
                res.json({
                    success : false,
                    msg : '更新失败'
                });
            }else{
                res.json({
                    success : true,
                    msg : '更新成功'
                });
            }
        });
    }
});

router.post('/news/del', function (req, res, next) {
    var id = req.body.id;
    newsModel.del(id, function(err){
        if(err){
            res.json({
                success : false,
                msg : '删除失败'
            });
        }else{
            res.json({
                success : true,
                msg : '删除成功'
            });
        }
    });
});

router.post('/news/list', function (req, res, next) {
    var pageNo = parseInt(req.body.pageNo);
    var pageSize = parseInt(req.body.pageSize);

    newsModel.queryNewsTotalCount(function (totalCount) {
        var totalPage = 0;
        if (totalCount % pageSize == 0) totalPage = totalCount / pageSize;
        else totalPage = totalCount / pageSize + 1;
        totalPage = parseInt(totalPage, 10);
        var start = pageSize * (pageNo - 1);
        newsModel.queryNews(start, pageSize, function (err, result) {
            if (err || !result || !commonUtils.isArray(result)) {
                logger.error("查找出错", err);
                return res.json({
                    success: false,
                    msg: "查找出错"
                });
            } else {
                for (var i in result) {
                    console.log(new Date(result[i].create_time));
                    // result[i].create_time = commonUtils.formatDate(new Date(result[i].create_time).getTime());
                }
                res.json({
                    success: true,
                    msg: "查找文章成功",
                    data: {
                        totalCount: totalCount,
                        totalPage: totalPage,
                        currentPage: pageNo,
                        list: result
                    }
                });
            }
        });
    });
});


router.post('/team/list', function (req, res, next) {
    indexModel.queryTeamer(function (err, teamers) {
        if(err){
            return res.json({
                success: false,
                msg: "查找出错"
            });
        }
        return res.json({
            success: true,
            data : {
                list : teamers
            }
        });
    });
});

router.post('/team/save', function (req, res, next) {
    var id = req.body.id;
    var name = req.body.name;
    var desc = req.body.desc;
    var avatar = req.body.avatar;
    if(avatar){
        avatar = avatar.replace('\/', '\\');
    }
    if(!id){
        indexModel.insertTeamer(name, desc, avatar, function(err){
            if(err){
                res.json({
                    success : false,
                    msg : '更新失败'
                });
            }else{
                res.json({
                    success : true,
                    msg : '更新成功'
                });
            }
        });
    }else{
        indexModel.updateTeamer(id, name, desc, avatar, function(err){
            if(err){
                res.json({
                    success : false,
                    msg : '更新失败'
                });
            }else{
                res.json({
                    success : true,
                    msg : '更新成功'
                });
            }
        });
    }
});

router.post('/team/del', function (req, res, next) {
    var id = req.body.id;
    indexModel.delTeamer(id, function(err){
        if(err){
            res.json({
                success : false,
                msg : '刪除失败'
            });
        }else{
            res.json({
                success : true,
                msg : '刪除成功'
            });
        }
    });
});

router.post('/sort', function (req, res, next) {
    var teamers = req.body.list;
    if(teamers){
        teamers = JSON.parse(teamers);
    }
    var length = teamers.length;
    var count = 0;
    for(var key in teamers){
       indexModel.sortTeamer(teamers[key], function(err){
            if(err){
                res.json({
                    success : false,
                    msg : '失败'
                });
            }else{
                count++;
                
            }
        });
    }
    var t = setInterval(function(){
        if(count >= length){
            clearInterval(t);
            return res.json({
                success : true,
                msg : '成功'
            });
        }
    },500);
});

router.get('/sort/:id', function (req, res, next) {
    var id = req.params.id
    res.render('admin/index/sort', {id,id});
});



module.exports = router;

