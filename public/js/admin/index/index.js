(function(P){
	var _this = null;
	_this = P.admin.index = {
		searchUrl : 'index/res/list',
		pid : 10,//系统根目录编号
		tpl : {
			articleTpl : null,
			resourceTpl : null
		},
		data : {
			userMap : {},
			searchData : {
				pageSize : 10,
				pageNo : 1	
			}
		},
		queryData : {
			pageSize : 5,
			pageNo : 1
		},
		init : function() {
			_this.tpl.newsTpl = juicer($('#news-tpl').html());
			_this.tpl.articleTpl  = juicer($('#article-tpl').html());
			_this.tpl.topListTpl = juicer($('#top-resource-tpl').html());
			_this.tpl.resourceTpl = juicer($('#resource-tpl').html());
			_this.tpl.msgTpl = juicer($('#message-tpl').html());
			_this.tpl.teamTpl = juicer($('#team-tpl').html());
			_this.initEditor();
			_this.initEvent();
			_this.data.searchData.mid = 100101;
			_this.showEditor(100101);

			// _this.initUploader('/upload/file', 'jpg,png,gif,JPG,PNG,GIF');
		},
		initEvent : function(){
			$('#btn_commit').click(_this.commit);
			$('#btn_modify').click(_this.commitInfo);

			$('.resource-opr').on('click', '.add', _this.showAddRes);
			$('#resource_list').on('click', '.edit', _this.showEditRes);
			$('body').on('click', '.oper .del',_this.showDelRes);
			$('body').on('click', '.del-res',_this.showDel);
			$('body').on('click', '.nav-tabs li', _this.changeType);

			$('body').on('click', '.res-menu button.btn-info', function(){
				var $this = $(this);
				$('.res-menu li').removeClass('active');
				$this.addClass('active');
				_this.data.searchData.mid = $this.attr('data-id');
				_this.data.searchData.moduleId = $this.attr('data-id');
				_this.$topPanel = $('#top_list');
				_this.$panel = $('#resource_list');
				_this.$pagebar = $('#pagebar');
				_this.loadTop();
				_this.loadRes();
				$('#tree_panel').show();
			});

			$('body').on('click', '.btnup', _this.up);
			$('body').on('click', '.btndown', _this.down);
			$('body').on('click', '.mv-up', _this.mvup);
			$('body').on('click', '.mv-down', _this.mvdown);

			_this.initMsgEvent();
			_this.initNewsEvent();
			_this.initTeamEvent();			
			$('body').on('click', '.setting', function(){
				window.location.href = 'admin/index/sort/' + $(this).attr('data-id');
			});

		},
		changeType : function(){
			var $this = $(this);
			$this.addClass('active').siblings('li').removeClass('active');
			var type = $this.attr('data-type');
			var mid = $this.attr('data-mid');
			_this.data.searchData.mid = mid;
			$('#editor_panel').hide();
			$('#list_panel').hide();
			$('#tree_panel').hide();
			$('#pic_panel').hide();
			$('#nnn_panel').hide();
			$('#msg_panel').hide();
			$('#team_panel').hide();
			if(type == 1 || type == 4 || type == 3  || type == 6){//|| type == 2
				_this.showEditor(mid);
				$('#editor_panel').show();
			}
			// if(type == 4){
			// 	_this.$topPanel = $('#s_top_list');
			// 	_this.$panel = $('#s_resource_list');
			// 	_this.$pagebar = $('#s_pagebar');
			// 	_this.loadTop();
			// 	_this.loadRes();
			// 	$('#list_panel').show();	
			// }

			if(type == 2){
				_this.loadTeam();
				$('#team_panel').show();
			}

			if(type == 5){
				_this.data.searchData.mid = 1;
				_this.data.searchData.moduleId = 1;
				_this.$topPanel = $('#top_list');
				_this.$panel = $('#resource_list');
				_this.$pagebar = $('#pagebar');
				_this.loadTop();
				_this.loadRes();
				$('#tree_panel').show();
			}
			// if(type == 7){
			// 	_this.loadNews();
			// 	$('#pic_panel').show();
			// }

			if(type == 7){
				_this.loadNews();
				$('#nnn_panel').show();
			}

			if(type == 8){
				_this.loadMsg();
				$('#msg_panel').show();
			}
		},
		// loadNews : function(){
		// 	var $panel = $('#news_panel');
		// 	$.ajax({
		// 		type : 'post',
		// 		url : 'admin/news',
		// 		beforeSend : function(){
		// 			$panel.html(util.loadingPanel);
		// 		},
		// 		success : function(data){
		// 			if(data.success){
		// 				var list = data.list;
		// 				var length = list.length;
		// 				while(length < 5){
		// 					length++;
		// 					list.push({
		// 						title : '',
		// 						link : '',
		// 						pic_url : '',
		// 						index : length
		// 					});
		// 				}
		// 				$panel.html(_this.tpl.newsTpl.render(data));	
		// 			}
		// 		}
		// 	});
		// },
		commit : function(){
			var $infos = $('.news-edit');
			var newsList = [];
			$infos.each(function(i){
				var index = i+1;
				var $this = $(this);
				var news = {
					title : $this.find('.newstitle').val(),
					link : $this.find('.link').val(),
					pic_url : $this.find('.pic_url').val(),
					index : index
				}
				if(news.title && news.link && news.pic_url ){
					newsList.push(news);	
				}
			});
			var $btn = $('#btn_commit');
			$.ajax({
				type : 'post',
				url : 'admin/setnews',
				data : {newsStr: JSON.stringify(newsList)},
				beforeSend : function(){
					$btn.val('正在提交');
				},
				success : function(data){
					if(data.success){
						util.dialog.infoDialog('修改成功');
					}else{
						util.dialog.infoDialog('修改失败');
					}
				},
				complete : function(){
					$btn.val('提交');
				}
			});
		},
		loadTop : function(){
			$.ajax({
				type : 'post',
				url : 'index/res/up',
				async : false,
				data : {mid:_this.data.searchData.mid},
				beforeSend : function(){
					_this.$topPanel.html(util.loadingPanel);
				},
				success : function(result){
					var data = result.data;
					_this.topMap = {};
					for(var index in data.list){
						var top = data.list[index];
						_this.topMap[top.id] = top;
					}
				    _this.$topPanel.html(_this.tpl.topListTpl.render(data));
				}
			});
		},
		loadRes : function() {
			$.ajax({
				type : "post",
				url : 'index/res/list',
				data : _this.data.searchData,
				beforeSend : function() {
					_this.$panel.html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
				},
				success : _this.initPageRes
			});
		},
		initPageRes : function(data) {
			if (!data.success) {
				util.dialog.infoDialog('查询出错');
				return;
			}
			data = data.data;
			var list = [];
			for ( var index in data.list) {
				var resource = data.list[index];
				if(!_this.topMap[resource.id]){
					list.push(resource);
				}
			}
			
			var totalPage = data.totalPage;
			var totalcount = data.totalCount;
			var html = _this.tpl.resourceTpl.render({list:list});
			if(totalcount == 0){
				html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
			}
			_this.$panel.html(html);
			
			if (totalPage <= 1) {
				_this.$pagebar.html('');
			}
			if (totalPage >= 2) {
				$(function() {
					$.fn.jpagebar({
						renderTo : _this.$pagebar,
						totalpage : totalPage,
						totalcount : totalcount,
						pagebarCssName : 'pagination2',
						currentPage : data.currentPage,
						onClickPage : function(pageNo) {
							$.fn.setCurrentPage(this, pageNo);
							_this.data.searchData.pageNo = pageNo;
							if (_this.instance_resource == null)
								_this.instance_resource = this;
							var data = _this.data.searchData;
							$.ajax({
								type : "post",
								url : _this.searchUrl,
								data : data,
								beforeSend : function() {
									_this.$panel.html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
								},
								success : function(data){
									if (!data.success) {
										util.dialog.infoDialog('查询出错');
										return;
									}
									data = data.data;
								
									var list = [];
									for ( var index in data.list) {
										var resource = data.list[index];
										if(!_this.topMap[resource.id]){
											list.push(resource);
										}
									}
									var totalPage = data.totalPage;
									var totalcount = data.totalCount;
									var html = _this.tpl.resourceTpl.render({list:list});
									if(totalcount == 0){
										html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
									}
									_this.$panel.html(html);
								}
							});
						}
					});
				});
			}
		},
		showAddRes : function(){
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/edit?menuPath=' + menuPath);
		},
		showEditRes : function(){
			var id = $(this).attr('data-id');
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/edit/' + id + '?menuPath=' + menuPath);
		},
		showDelRes : function(){
			var id = $(this).attr('data-id');
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/article/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								_this.searchResource();
							}else{
								util.dialog.infoDialog(result.msg);
							}
							
						}
					});
				},
				function(){},
				'确认删除'
			);
		},
		showDel : function(){
			var id = $(this).attr('data-id');
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/resource/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								_this.loadRes();
							}else{
								util.dialog.infoDialog(result.msg);
							}
							
						}
					});
				},
				function(){},
				'确认删除'
			);
		},
		initEditor : function(){
			_this.editor = new Simditor({
			  	textarea: $('#editor'),
			  	height : '100%',
			  	upload : {
			    	url: 'upload/img',
				    params: null,
				    fileKey: 'upload_file',
				    connectionCount: 3,
				    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			  	}
			});

			_this.msgEditor = new Simditor({
			  	textarea: $('#msg_editor'),
			  	upload : {
			    	url: 'upload/img',
				    params: null,
				    fileKey: 'upload_file',
				    connectionCount: 3,
				    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			  	}
			});

			_this.newsEditor = new Simditor({
			  	textarea: $('#news_editor'),
			  	upload : {
			    	url: 'upload/img',
				    params: null,
				    fileKey: 'upload_file',
				    connectionCount: 3,
				    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			  	}
			});
			// _this.teamEditor = $('#team_editor'); 
			_this.teamEditor = new Simditor({
				toolbar : false,
			  	textarea: $('#team_editor'),
			  	upload : {
			    	url: 'upload/img',
				    params: null,
				    fileKey: 'upload_file',
				    connectionCount: 3,
				    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			  	}
			});
		},
		midMap : {
			'100101' : {type:1},
			'100102' : {type:1},
			'100104' : {type:1},
			'1002'   : {type:1},
			'1005'   : {type:1},
			'1003'   : {type:2,smid:100301}
		},
		showEditor : function(mid){
			var data = _this.midMap[mid];
			_this.mid = mid;
			if(data && data.type == 1){
				$.ajax({
					type : "post",
					url : 'admin/index/info/view/' + mid,
					success : function(data){
						if(data.success){
							_this.editor.setValue(data.data.content);
						}else{
							util.dialog.infoDialog(data.msg);
						}
					}
				});
			}
		},
		commitInfo : function() {
			var mid = _this.data.searchData.mid;
			var data = _this.midMap[mid];
			
			if(data.type == 1 && data.smid){
				mid = data.smid;
			}
			var content = _this.editor.getValue();
			var $content = $('<div>' + content + '</div>');
			$content.find('img').each(function(){
				var $img = $(this);
				var src = $img.attr('src');
				if(src.indexOf('8200') != -1){
					src = src.split('8200')[1];
					$img.attr('src', src);
				}
			});
			content = $content.html();
			
			var postData = {
				content : content,
				mid : mid
			};
			$.ajax({
				url : 'admin/index/info/save',
				type : 'post',
				data : postData,
				success : function(data){
					util.dialog.infoDialog('提交成功');
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		},
		up : function(){
			var $this = $(this);
			var mid = _this.data.searchData.mid;
			var res_id = $this.attr('data-id');
			$.ajax({
				type : "post",
				url : 'admin/index/setup',
				data : {
					mid : mid,
					res_id : res_id
				},
				success : function(data){
					if(data.success){
						util.dialog.infoDialog('置顶成功');
						_this.loadTop();
						_this.loadRes();
					}else{
						util.dialog.infoDialog(data.msg);
					}
				}
			});
		},
		down : function(){
			var $this = $(this);
			var mid = _this.data.searchData.mid;
			var res_id = $this.attr('data-id');
			$.ajax({
				type : "post",
				url : 'admin/index/setdown',
				data : {
					mid : mid,
					res_id : res_id
				},
				success : function(data){
					if(data.success){
						util.dialog.infoDialog('取消成功');
						_this.loadTop();
						_this.loadRes();
					}else{
						util.dialog.infoDialog(data.msg);
					}
				}
			});
		},

		//msg start
		initMsgEvent : function(){
			$('body').on('click', '#msg_box ul li', _this.selectMsg);
			$('body').on('click', '#btn_add_msg', _this.addMsg);
			$('body').on('click', '#btn_del_msg', _this.delMsg);
			$('body').on('click', '#btn_save_msg', _this.saveMsg);
		},
		loadMsg : function(){
			var queryData = {
				pageNo : 1,
				pageSize : 7
			};
			$.ajax({
				type : "post",
				url : 'admin/message/list',
				data : _this.data.searchData,
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog(result.msg);
					}else{
						var html = _this.tpl.msgTpl.render(result.data);
						$('#msg_list_panel').html(html);
						_this.data.msgMap = {};
						for(var index in result.data.list){
							var message = result.data.list[index];
							_this.data.msgMap[message.id] = message;
						}
					}
				}
			});
		},
		selectMsg : function(){
			var $this = $(this);
			var id = $this.attr('data-id'); 
			_this.data.msgId = id;
			$this.addClass('active').siblings('li').removeClass('active');
			var message = _this.data.msgMap[id];
			$('#msg_title').val(message.title);
			_this.msgEditor.setValue(message.content);
		},
		addMsg : function(){
			_this.data.msgId = '';
			$('#msg_title').val('');
			_this.msgEditor.setValue('');
		},
		delMsg : function(){
			if(!_this.data.msgId){
				util.dialog.infoDialog('未选中信息');
			}else{
				$.ajax({
					type : "post",
					url : 'admin/message/del',
					data : {id:_this.data.msgId},
					success : function(result){
						if(!result.success){
							return util.dialog.infoDialog(result.msg);
						}else{
							_this.loadMsg();
							util.dialog.toastDialog('删除成功');
						}
					}
				});
			}
		},
		saveMsg : function(){
			var data = {
				title : $('#msg_title').val(),
				content : _this.msgEditor.getValue()
			};
			if(_this.data.msgId){
				data.id = _this.data.msgId;
			}
			$.ajax({
				type : "post",
				url : 'admin/message/save',
				data : data,
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog(result.msg);
					}else{
						_this.loadMsg();
						util.dialog.toastDialog('保存成功');
					}
				}
			});
		},

		//news start
		initNewsEvent : function(){
			$('body').on('click', '#news_box ul li', _this.selectNews);
			$('body').on('click', '#btn_add_news', _this.addNews);
			$('body').on('click', '#btn_del_news', _this.delNews);
			$('body').on('click', '#btn_save_news', _this.saveNews);
		},
		loadNews : function(){
			var queryData = {
				pageNo : 1,
				pageSize : 20
			};
			$.ajax({
				type : "post",
				url : 'admin/index/news/list',
				data : _this.data.searchData,
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog(result.msg);
					}else{
						var html = _this.tpl.msgTpl.render(result.data);
						$('#news_list_panel').html(html);
						_this.data.newsMap = {};
						for(var index in result.data.list){
							var message = result.data.list[index];
							_this.data.newsMap[message.id] = message;
						}
					}
				}
			});
		},
		selectNews : function(){
			var $this = $(this);
			var id = $this.attr('data-id'); 
			_this.data.newsId = id;
			$this.addClass('active').siblings('li').removeClass('active');
			var message = _this.data.newsMap[id];
			$('#news_title').val(message.title);
			_this.newsEditor.setValue(message.content);
		},
		addNews : function(){
			_this.data.newsId = '';
			$('#news_title').val('');
			_this.newsEditor.setValue('');
		},
		delNews : function(){
			if(!_this.data.newsId){
				util.dialog.infoDialog('未选中信息');
			}else{
				$.ajax({
					type : "post",
					url : 'admin/index/news/del',
					data : {id : _this.data.newsId},
					success : function(result){
						if(!result.success){
							return util.dialog.infoDialog(result.msg);
						}else{
							_this.loadNews();
							util.dialog.toastDialog('删除成功');
						}
					}
				});
			}
		},
		saveNews : function(){
			var data = {
				title : $('#news_title').val(),
				content : _this.newsEditor.getValue()
			};
			var $content = $(data.content);
			var $imgs = $content.find('img');
			if($imgs.length > 0){
				var src = $imgs.first().attr('src');
				data.cover = src.split('8200')[1];
			}

			if(_this.data.newsId){
				data.id = _this.data.newsId;
			}
			$.ajax({
				type : "post",
				url : 'admin/index/news/save',
				data : data,
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog(result.msg);
					}else{
						_this.loadNews();
						util.dialog.toastDialog('保存成功');
					}
				}
			});
		},
		initUploader : function(uploadSrc, extensions) {// 初始化文件上传控件
			plupload.addI18n({
		        'File extension error.' : '文件类型错误',
		        'File size error.' : '文件大小超出限制'
		    });
			_this.fileUploader = new plupload.Uploader({
				runtimes : 'html5,flash',
				browse_button : 'btn_upload', // 选择文件按钮ID
				max_file_size : '100mb', // 文件上传最大值
				chunks : false,// 不分块上传
				unique_names : true, // 上传的文件名是否唯一,只有在未进行分块上传时文件名唯一才有效
				url : uploadSrc,
				flash_swf_url : 'js/lib/plupload/plupload.flash.swf',// plupload.flash.swf文件所在路径
				multi_selection : false,
				filters: [
				     {title: "允许文件类型", extensions: extensions}
		        ],
				init : {
					FileUploaded : function(up, file, info) {
						$('#btn_commit').css('disabled', '');// 启用保存按钮
						$('#btn_upload').text('修改文件');
						_this.fileUploader.disableBrowse(false);
						var data = eval('(' + info.response + ')');
						_this.fileName = data.fileName;
						if (data.success == false) {
							util.dialog.infoDialog(data.msg);
							return;
						} else {
							util.dialog.toastDialog('上传成功', 2000, function(){
								$('#process_bar').hide();
								$('#process_rate').css('width', '0');
								$('#process_rate').text('0%');
							});
						}
					},
					FilesAdded : function(up, file) {
						$.each(up.files, function (i, file) {
							if (up.files.length <= 1) {
					            return;
					        }
					        up.removeFile(file);
						});
						var orgName = file[0].name.substring(0,file[0].name.lastIndexOf('.')).replace(/[ ]/g,' ');
						$('#filename').text(orgName).show();
						_this.fileUploader.start();
					},
					BeforeUpload : function(up, file) {
						_this.fileUploader.disableBrowse(true);
						$('#btn_commit').css('disabled', 'disabled');// 禁用保存按钮
					},
					UploadProgress : function(up, file) {
						$('#process_bar').show();
						$('#process_rate').css('width', file.percent + '%');
						$('#process_rate').text(file.percent + '%');
					},
					Error : function(up, err) {
						$('#loading').hide();
						_this.fileUploader.disableBrowse(false);
						up.refresh(); // Reposition Flash/Silverlight
						// util.checkStatus(err);
					} 
				}
			});
			_this.fileUploader.init();
		},



		initTeamEvent : function(){
			$('body').on('click', '#team_box ul li', _this.selectTeam);
			$('body').on('click', '#btn_add_team', _this.addTeam);
			$('body').on('click', '#btn_del_team', _this.delTeam);
			$('body').on('click', '#btn_save_team', _this.saveTeam);
			_this.initTeamUploader('/upload/img', 'jpg,png,gif,JPG,PNG,GIF');
			// _this.initUploader('/upload/file', 'jpg,png,gif,JPG,PNG,GIF');
		},
		loadTeam : function(){
			$.ajax({
				type : "post",
				url : 'admin/index/team/list',
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog(result.msg);
					}else{
						var html = _this.tpl.teamTpl.render(result.data);
						$('#team_list_panel').html(html);
						_this.data.teamMap = {};
						for(var index in result.data.list){
							var message = result.data.list[index];
							_this.data.teamMap[message.id] = message;
						}
					}
				}
			});
		},
		selectTeam : function(){
			var $this = $(this);
			var id = $this.attr('data-id'); 
			_this.data.teamId = id;
			console.log(_this.data.teamId);
			$this.addClass('active').siblings('li').removeClass('active');
			var message = _this.data.teamMap[id];
			$('#team_title').val(message.name);
			_this.teamEditor.setValue(message.info);
			if(message.avatar){
				$('#team_avatar').val(message.avatar);
				$('#avatar_team').html('<img src="' + message.avatar + '">');
			}else{
				$('#team_avatar').val('');
				$('#avatar_team').html('');
			}
		},
		addTeam : function(){
			_this.data.teamId = '';
			$('#team_title').val('');
			$('#team_avatar').val('');
			$('#avatar_team').html('');
			_this.teamEditor.setValue('');
		},
		delTeam : function(){
			console.log(_this.data.teamId);
			if(!_this.data.teamId){
				util.dialog.infoDialog('未选中信息');
			}else{
				$.ajax({
					type : "post",
					url : 'admin/index/team/del',
					data : {id : _this.data.teamId},
					success : function(result){
						if(!result.success){
							return util.dialog.infoDialog(result.msg);
						}else{
							_this.loadTeam();
							util.dialog.toastDialog('删除成功');
						}
					}
				});
			}
		},
		saveTeam : function(){
			var avatar = $('#team_avatar').val();
			var desc = _this.teamEditor.getValue();
			var data = {
				name : $('#team_title').val(),
				avatar : avatar,
				desc : desc
			};
			if(_this.data.teamId){
				data.id = _this.data.teamId;
			}
			$.ajax({
				type : "post",
				url : 'admin/index/team/save',
				data : data,
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog(result.msg);
					}else{
						_this.loadTeam();
						util.dialog.toastDialog('保存成功');
					}
				}
			});
		},
		initTeamUploader : function(uploadSrc, extensions) {// 初始化文件上传控件
			plupload.addI18n({
		        'File extension error.' : '文件类型错误',
		        'File size error.' : '文件大小超出限制'
		    });
			_this.teamUploader = new plupload.Uploader({
				runtimes : 'html5,flash',
				browse_button : 'btn_upload_team', // 选择文件按钮ID
				max_file_size : '100mb', // 文件上传最大值
				chunks : false,// 不分块上传
				unique_names : true, // 上传的文件名是否唯一,只有在未进行分块上传时文件名唯一才有效
				url : uploadSrc,
				flash_swf_url : 'js/lib/plupload/plupload.flash.swf',// plupload.flash.swf文件所在路径
				multi_selection : false,
				filters: [
				     {title: "允许文件类型", extensions: extensions}
		        ],
				init : {
					FileUploaded : function(up, file, info) {
						_this.teamUploader.disableBrowse(false);
						var data = eval('(' + info.response + ')');
						_this.fileName = data.fileName;
						$('#team_avatar').val('/uploads/' + _this.fileName);
						$('#avatar_team').html('<img src="' + data.filePath + '">');
						if (data.success == false) {
							util.dialog.infoDialog(data.msg);
							return;
						} else {
							util.dialog.toastDialog('上传成功', 2000, function(){
								$('#process_bar').hide();
								$('#process_rate').css('width', '0');
								$('#process_rate').text('0%');
							});
						}
					},
					FilesAdded : function(up, file) {
						$.each(up.files, function (i, file) {
							if (up.files.length <= 1) {
					            return;
					        }
					        up.removeFile(file);
						});
						_this.teamUploader.start();
					},
					BeforeUpload : function(up, file) {
						_this.teamUploader.disableBrowse(true);
					},
					UploadProgress : function(up, file) {
						$('#process_bar').show();
						$('#process_rate').css('width', file.percent + '%');
						$('#process_rate').text(file.percent + '%');
					},
					Error : function(up, err) {
						$('#loading').hide();
						_this.teamUploader.disableBrowse(false);
						up.refresh(); // Reposition Flash/Silverlight
						// util.checkStatus(err);
					} 
				}
			});
			_this.teamUploader.init();
		},
		mvup : function(event){
			var $this = $(this);
			var $li = $this.parent('div').parent('li');
			var $preli = $li.prev('li');
			if($preli.length > 0){
				$preli.before($li);
			}
			_this.resetSort();
			event.preventDefault();
			event.stopPropagation();
		},
		mvdown : function(event){
			var $this = $(this);
			var $li = $this.parent('div').parent('li');
			var $nestli = $li.next('li');
			if($nestli.length > 0){
				$nestli.after($li);	
			}
			_this.resetSort();
			event.preventDefault();
			event.stopPropagation();
		},
		resetSort : function(){
			var $lis = $('#team_list_panel').find('li');
			var data = [];
			$lis.each(function(i){
				var id = $(this).attr('data-id');
				data.push({
					id : id,
					index : i
				});
			});
				console.log(data);

			$.ajax({
				url : 'admin/index/sort',
				type : 'post',
				data : {list: JSON.stringify(data)},
				success : function(){

				},
				error : function(){
					util.dialog.infoDialog('调整失败，请重试');
				}
			});
		}
	};
}(moka));
