var menuModel = require('../models/menuModel.js');
var commonUtils = require("../lib/utils.js");

var menuList = null;
var menuMap = '';

var getMenuList = function(callback){
	if(menuList){
		return menuList;
	}else{
		menuModel.queryAllMenu(function (err, result) {
	        if (err || !result || !commonUtils.isArray(result)) {
	            return [];
	        } else {
	        	menuList = result;
	        	if(callback){
	        		callback(menuList);	
	        	}
	        	return menuList;
	        }
	    });
	}
};

var getMenuMap = function(){
	if(menuMap){
		return menuMap;
	}else{
		menuMap = {};
		for(var index in menuList){
	    	var menu = menuList[index];
	    	menu['submenu'] = [];
	    	menuMap[menu.id] = menu;
    	}

    	for(var key in menuMap){
	    	var menu = menuMap[key];
	    	if(menu.parent_id != 0){
	    		if(!menuMap[menu.parent_id]){
	    			console.log(menu);
	    		}
    			menuMap[menu.parent_id]['submenu'].push(key);
	    	}
    	}
    	return menuMap;
	}
};

var getMenuPath = function(mid, callback){
	var menuArr = [];
	if(menuMap){
		var menu = menuMap[mid];
		var mlevel = menu.mlevel;
		for(var i=0;i<mlevel;i++){
			menuArr.push(menu.id);
			var pid = menu.parent_id;
			menu = menuMap[pid];
		}
		return menuArr.join(',');
	}else{
		return '';
	}
};


var getMenuPathList = function(mid, callback){
	var menuArr = [];
	if(menuMap){
		var menu = menuMap[mid];
		if(!menu){
			console.log(mid);
			return menuArr;
		}
		var mlevel = menu.mlevel;
		
		for(var i=0;i<mlevel;i++){
			menuArr.unshift(menu);
			var pid = menu.parent_id;
			if(pid > 0)
				menu = menuMap[pid];
		}
		return menuArr;
	}else{
		return menuArr;
	}
};

var refreshMenu = function(callback){
	menuList = null;
	menuMap = null;
	getMenuList(getMenuMap);
};

module.exports.getMenuList = getMenuList;
module.exports.getMenuMap = getMenuMap;
module.exports.getMenuPath = getMenuPath;
module.exports.getMenuPathList = getMenuPathList;
module.exports.refreshMenu = refreshMenu;

