var indexModel = require("../models/indexModel");
var commonUtils = require("../lib/utils.js");

var moduleMap = {};

var getDBIndexModules = function(callback){
	indexModel.queryModules(function(err, results){
    	if(err){
    		callback(err);
    	}else{
    		for(var index in results){
    			var module = results[index];
    			
    			moduleMap[module.id] = module;
    		}
            // console.log(moduleMap);
    		if(callback){
    			callback(moduleMap);	
    		}
    	}
    });
};

var getModuleMap = function(){
	return moduleMap;
};
exports.getDBIndexModules = getDBIndexModules;
exports.getModuleMap = getModuleMap;

