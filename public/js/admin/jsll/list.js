(function(P){
	var _this = null;
	_this = P.admin.jsll.list = {
		searchUrl : 'jsll/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		tpl : {},
		data : {
			searchData : {
				pageNo : 1,
				pageSize : 10000
			}
		},
		init : function() {
			_this.tpl.menuTpl = juicer($('#menu_tpl').html());
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.data.picTpl = juicer($('#pic_tpl').html());
			_this.data.videoTpl = juicer($('#video_tpl').html());
			_this.data.pptTpl = juicer($('#ppt_tpl').html());
			_this.data.editMenuDlgTpl = juicer($('#edit_menu_dlg').html());
			_this.data.type = 1;
			_this.data.key = '政策';
			_this.editor = $('#content');
			_this.txt_editor = $('#txt_editor');
			_this.initEvent();
			_this.changeType({init: true});
		},
		initEvent : function(){
			$('.nav-tabs').on('click', 'li', _this.changeType);

			$('#menu_list').on('click', 'li', _this.onSel);
			$('body').on('click', '.add', _this.onAdd);
			$('body').on('click', '.del', _this.onDel);

			$('.tree-opr').on('click', '.unfold',function(){
				var zTree = _this.getCurrTree();
				zTree.expandAll(true);
				$(this).removeClass('unfold').addClass('shrink').text('收缩');
			});
				
			$('.tree-opr').on('click', '.shrink',function(){
				var zTree = _this.getCurrTree();
				zTree.expandAll(false);
				$(this).removeClass('shrink').addClass('unfold').text('展开');
			});
			$('#btn_commit').on('click', _this.save);
			$('#btn_txt').on('click', _this.save);
		},
		changeType : function(options){
			var $this = $(this);
			if(options && options.init){
				$this = $('.nav-tabs li').first();
			}
			$this.addClass('active').siblings().removeClass('active');

			_this.data.type = $this.attr('data-type');
			_this.data.key = $this.attr('data-key');

			if(_this.data.type == 1){
				$('#menu_panel').show();
				$('#tree_panel').hide();
				_this.loadRule();
			}else{
				$('#menu_panel').hide();
				$('#tree_panel').show();
				if(_this.data.type == 2){
					// $('#p_tree_panel').show();
					_this.initTopic();
				}
				if(_this.data.type == 3){
					_this.initTopic();
				}
				if(_this.data.type == 4){
					_this.initTopic();
				}
					
			}
		},
		loadRule : function(){
			$.ajax({
				url : 'jsll/list/' + _this.data.key,
				type : 'post',
				success : function(result){
					if(result.success){
						var html = _this.tpl.menuTpl.render(result.data);
						$('#menu_list').html(html);
						_this.listMap = {};
						for(var index in result.data.list){
							var item = result.data.list[index];
							_this.listMap[item.id] = item;
							if(index == 0){
								_this.id = item.id;
								$('#content_title').val(item.title);
								$('#content').val(item.content);
							}
						}
						$('#menu_list li .btn-info').first().addClass('active');
					}else{
						$('#menu_list').html('');
						$('#content_title').val('');
						$('#content').val('');			
					}
				}
			});
		},
		onSel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var item = _this.listMap[id];
			_this.currItem = item;
			_this.id = id;
			$('#content_title').val(item.title);
			$('#content').val(item.content);
		},
		initTopic : function() {
			var searchUrl = '';
			if(_this.data.type == 2){
				searchUrl =  'jsll/list/理论';//jsll/tree/1403';
			}
			if(_this.data.type == 3){
				searchUrl =  'jsll/info/list/tplan';
			}
			if(_this.data.type == 4){
				searchUrl =  'menu/tree/1401';
			}
			if(_this.data.type == 4){
				$('#txt_panel').hide();
				$('#resource_panel').show();
			}else{
				$('#txt_panel').show();
				$('#resource_panel').hide();
			}
			
			$.ajax({
				type : "post",
				cache : false,
				url : searchUrl,
				dataType : 'json',
				beforeSend : function() {
					$('#topic_tree').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><div style="color:#999999;display:inline-block;font-size:12px;margin-left:5px;vertical-align:bottom;">载入中...</div></div>');
				},
				success : _this.handleTopic 
			});
		},
		handleTopic : function(data) {
			_this.topicNodes = [];
			var list = data.data.list;
			for(var index in list){
				var menu = list[index];
				if(menu.pid){
					menu.parent_id = menu.pid;	
				}
				if(menu.parent_id){
					menu.pid = menu.parent_id;
				}
				
				
				if(menu.title && !menu.name){
					menu.name = menu.title;	
				}
				if(menu.name == '教案'){
					continue;
				}
				_this.topicNodes.push(menu);
			}
			if(_this.data.type == 4){
				var searchUrl = 'article/queryArticleByMenu';
				var data = _this.data.searchData;
				if(_this.data.keyword){
					searchUrl = 'article/queryArticleByTitle';
				}else{
					searchUrl = 'article/queryArticleByMenu';
				}

				
				if(_this.data.type == 2){
					data.mid = 1403;
				}
				if(_this.data.type == 3){
					data.mid = 1402;
				}
				if(_this.data.type == 4){
					data.mid = 1401;
				}

				$.ajax({
					type : "post",
					async : false,
					url : searchUrl,
					data : data,
					success : function(result){
						if(result.success){
							var list = result.data.list;
							for(var index in list){
								var menu = list[index];
								if(menu.title && !menu.name){
									menu.name = menu.title;	
								}
								menu.parent_id = menu.menu_id;
								// menu['pId'] = menu.parent_id;
								_this.topicNodes.push(menu);
							}
						}
					}
				});
			}
			_this.initTree();
		},
		setting : {
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false,
				showIcon : false
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",// id 自定义
					pIdKey : "parent_id",// 父节点id 自定义
					rootPId : 3532
				}
			},
			check : {
				enable : false
			},
			callback : {
				beforeClick : function(treeId, treeNode) {
					var zTree = _this.getCurrTree();
					if (treeNode.isParent) {
						zTree.expandNode(treeNode);
						return true;
					} else {
						return true;
					}
				},
				onClick: function(event,treeId, treeNode) {
					var zTree = _this.getCurrTree();
					var nodes = zTree.getCheckedNodes(true);
					if(_this.currNode && _this.currNode.id == treeNode.id){
						zTree.cancelSelectedNode(treeNode);
						_this.currNode = null;
						return false;
					}
					_this.currNode = treeNode;
					_this.id = _this.currNode.id;
					_this.pid = _this.currNode.id;
					if(_this.data.type == 4){
						$('#tree_content_title').val(_this.currNode.name);
						PDFObject.embed('uploads/'+ _this.currNode.view_name, "#ppt_pdf");
					}else{
						if(_this.currNode.content){
							if(_this.currNode.content == 'null'){
								_this.currNode.content == '';
							}
							$('#tree_content_title').val(_this.currNode.title);
							_this.txt_editor.html(_this.currNode.content);	
						}else{
							$.ajax({
								url : 'jsll/info/detail/' + _this.currNode.id,
								type : 'get',
								async : false,
								success : function(data){
									if(data.success){
										if(data.data.content == 'null'){
											data.data.content == '';
										}
										_this.currNode.content = data.data.content;
										$('#tree_content_title').val(_this.currNode.title);
										_this.txt_editor.html(_this.currNode.content);	
									}else{
										$('#content').html('');			
									}
								}
							});
						}
					}
					return true;
				}
			}
		},
		initTree : function() {// 初始化树功能，折叠展开点击事件
			var topicTree = $("#topic_tree");
			topicTree = $.fn.zTree.init(topicTree, _this.setting, _this.topicNodes);
			_this.topicTree = $.fn.zTree.getZTreeObj("topic_tree");
		},
		getCurrTree : function(){
			return _this.topicTree;
		},
		onAdd : function(){
			if(_this.data.type == 1){
				_this.id = '';
				_this.type = '政策';
				_this.pid = -1;
				$('#content_title').val('');
				$('#content').val('');	
			}
			if(_this.data.type == 2){
				_this.id = '';
				_this.type = '理论';
				if(!_this.pid){
					_this.pid = 0;
				}
				$('#tree_content_title').val('');
				$('#txt_editor').val('');	
			}
		},
		onDel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			if(_this.data.type == 2){
				id = _this.id;
			}
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/jsll/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								$this.parent('div').parent('li').remove();
								_this.initTopic();
								util.dialog.toastDialog('删除成功');
							}else{
								alert(result.msg);
							}
						}
					});
				},
				function(){},
				'确认删除'
			);
		},
		save : function() {
			var postData = {};
			if(_this.data.type == 1){
				postData = {
					content : $('#content').val(),
					title : $('#content_title').val()
				};	
			}else{
				postData = {
					content : $('#txt_editor').val(),
					title : $('#tree_content_title').val()
				};	
			}
			
			if(_this.id){
				postData.id = _this.id;
			}else{
				postData.type = _this.type;
				postData.pid = _this.pid;
			}
			$.ajax({
				url : 'admin/jsll/save',
				type : 'post',
				data : postData,
				success : function(data){
					_this.loadRule();
					_this.initTopic();
					util.dialog.toastDialog('提交成功');
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		},


		onAddPPT : function(){
			_this.id = '';
			$('#ppt_path').val('');
			$('#tree_content_title').val('');
			$('#ppt_pdf').html('');	
		},
		onDelPPT : function(){
			var id = _this.id;;
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/jsll/delPPT',
						data : {id:id},
						success : function(result){
							if(result.success){
								_this.initTopic();
								util.dialog.toastDialog('删除成功');
							}else{
								alert(result.msg);
							}
						}
					});
				},
				function(){},
				'确认删除'
			);
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
		commit : function() {
			var fileName = _this.fileName;
			if(fileName.indexOf('/uploads/') != -1){
				fileName = fileName.split('/uploads/')[1];
			}
			var postData = {
				title : $('#tree_content_title').val();
				fileName : _this.fileName,
				mid : _this.pid
			};

			if(_this.id != null){
				postData.id = _this.id;
			}

			$.ajax({
				url : 'admin/article/save',
				type : 'post',
				data : postData,
				success : function(result){
					if(!result.success){
						util.dialog.errorDialog('提交失败请重试');
						return;
					}
					_this.initTopic();
					util.dialog.toastDialog('提交成功');
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		}
	};
}(moka));