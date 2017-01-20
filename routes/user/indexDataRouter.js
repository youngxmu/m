var express = require('express');
var config = require("../config");
var logger = require("../lib/log.js").logger("indexRouter");
var commonUtils = require("../lib/utils.js");
var menuUtils = require("../lib/menuUtils.js");
var articleModel = require('../models/articleModel.js');
var infoModel = require('../models/infoModel.js');
var paperModel = require('../models/paperModel.js');
var newsModel = require('../models/newsModel.js');
var indexModel = require('../models/indexModel.js');
var menuModel = require('../models/menuModel.js');
var resourceModel = require('../models/resourceModel.js');
var messageModel = require('../models/messageModel.js');

var router = express.Router();

router.post('/init', function (req, res, next) {
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


module.exports = router;

