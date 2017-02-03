var moka = {
	building : '<div class="building">资源建设中...</div>',
	index : {

	},
	admin : {
		user : {},
		paper : {},
		question : {},
		article : {},
		expert : {},
		vote : {},
		jsll : {},
		jsjn : {},
		hbll : {},
		teacher : {}
	},
	user : {
		resource : {},
		user : {},
		vote : {},
		paper : {},
		exam : {},
		paperhistory : {},
		question : {},
		article : {},
		expert : {},
		jsll : {},
		jsjn : {},
		hbll : {}
	},
	model : {},
	album : {},
	article :{//用户管理
		detail : {},
		list : {}
	},
	resource : {},
	fileType:{
		'JSON' : '0',
		'PPT' : '0',
		'PPTX' : '0',
		'DOC' : '1',
		'DOCX' : '1',
		'PDF' : '2',
		'PNG' : '3',
		'JPEG' : '3',
		'JPG' : '3',
		'BMP' : '3',
		'GIF' : '3',		
		'WMV' : '4',
		'AVI' : '4',
		'RM' : '4',
		'RMVB' : '4',
		'DAT' : '4',
		'ASF' : '4',
		'RAM' : '4',
		'MPG' : '4',
		'MPEG' : '4',
		'3GP' : '4',
		'MOV' : '4',
		'MP4' : '4',
		'M4V' : '4',
		'DVIX' : '4',
		'DV' : '4',
		'MKV' : '4',
		'FLV' : '4',
		'VOB' : '4',
		'QT' : '4',
		'CPK' : '4',
		'VOB' : '4',
		'MP3' : '5',
		'WAV' : '5',
		'TXT' : '6'
	},
	fileTypeName : {
		0 : 'ppt',
		1 : 'doc',
		2 : 'pdf',
		3 : 'pic',
		4 : 'video',
		5 : 'mp3',
		6 : 'txt'
	}
};

var util = {
	_word : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
	getOption : function(index){
		if(index > 0){
			index = index - 1;
		}
		return util._word[index];
	},
	formatIndex : function(index){
		return parseInt(index, 10) + 1;
	},
	loadingPanel : '<div id="loading_panel" style="line-height:28px;padding:15px 0;text-align: center">'
			+ '<span style="display:inline-block;font-size:15px;color:#999999;"><img src="img/loading.gif" style="float:left;margin-right:15px;">正在加载...</span>'
			+ '</div>',
	date : {
		format : function(longTime){
			var date = new Date(longTime);

			var Year= date.getFullYear();//ie火狐下都可以 
			var Month= date.getMonth()+1; 
			var Day = date.getDate(); 
			var Hour = date.getHours(); 
			var Minute = date.getMinutes(); 
			var Second = date.getSeconds(); 

			if (Month < 10 ) { 
				Month = "0" + Month; 
			} 
			if (Day < 10 ) { 
				Day = "0" + Day; 
			}
			if (Hour < 10 ) { 
				Hour = "0" + Hour; 
			} 
			if (Minute < 10 ) { 
				Minute = "0" + Minute; 
			} 
			if (Second < 10 ) { 
				Second = "0" + Second; 
			}  

			var CurrentDate = Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second;

			return CurrentDate;
		},
		midFormat : function(longTime){
			var date = '';
			if(longTime.indexOf('T') != -1){
				date = longTime.split('T')[0];
			}else if (longTime.indexOf(' ') != -1){
				date = longTime.split(' ')[0];
			}else{
				date = new Date(longTime);
				var Year= date.getFullYear();//ie火狐下都可以 
				var Month= date.getMonth()+1; 
				var Day = date.getDate(); 

				if (Month < 10 ) { 
					Month = "0" + Month; 
				} 
				if (Day < 10 ) { 
					Day = "0" + Day; 
				}
				date = Year + '-' + Month + '-' + Day;
			}
			return date;
		}
	},
	dialog : {
		toastDialog : function(msg, timeout, callback){
			if(!timeout){
				timeout = 1500;
			}
			var dd = dialog({
			    content: msg,
			    width : 240,
			    onclose : function(){
			    	if(callback){
			    		callback();
			    	}
			    }
			});
			dd.showModal();
			setTimeout(function(){
				dd.close();
			}, timeout);
		},
		infoDialog : function(msg, callback){
			var dd = dialog({
			    title: '信息',
			    content: msg,
			    width : 240,
			    okValue : '确定',
			    ok : function(){
			    	if(callback){
			    		callback();
			    	}
			    }
			});
			dd.showModal();
			return dd;
		},
		errorDialog : function(msg){
			var d = dialog({
			    title: '错误信息',
			    content: msg,
			    width : 240,
			    okValue : '确定',
			    ok : function(){}
			});
			d.showModal();	
		},
		confirmDialog : function(content,successCallback,cancelCallback,title){
			if(!title)
				title = "信息";
			if(!successCallback){
				successCallback = function(){};
			}
			if(!cancelCallback){
				cancelCallback = function(){};
			}

			var d = dialog({
			    title: title,
			    content: content,
			    width : 240,
			    okValue : '确认',
     	        ok : successCallback,
     	        cancelValue : '取消',
     	        cancel : cancelCallback
			});
			d.showModal();	
		},
		defaultDialog : function(content,successCallback,cancelCallback,title){
			if(!title)
				title = "信息";
			if(!successCallback){
				successCallback = function(){};
			}
			if(!cancelCallback){
				cancelCallback = function(){};
			}

			var d = dialog({
			    title: title,
			    content: content,
			    width : 600,
			    okValue : '确认',
     	        ok : successCallback,
     	        cancelValue : '取消',
     	        cancel : cancelCallback
			});
			d.showModal();	
		}
	},

	getFileType : function(fileName){
		if(!fileName || fileName == ''){
			fileName = '1.TXT';
		}
		var index = fileName.lastIndexOf('.');
		var tail = fileName.substr(index + 1);
		var fileType = moka.fileType[tail.toUpperCase()];

		return moka.fileTypeName[fileType];
	},
	_word : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],
	getOption : function(index){
		if(index > 0){
			index = index - 1;
		}
		return util._word[index];
	},
	getTypeName : function(type){
		var typeName = moka.fileTypeName[type];
		return typeName;
	}
};

juicer.register('dateFormat', util.date.format);
juicer.register('midDateFormat', util.date.midFormat);
juicer.register('formatIndex', util.formatIndex);
juicer.register('getFileType', util.getFileType);
juicer.register('getTypeName', util.getTypeName);