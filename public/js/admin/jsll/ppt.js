(function(P){
	var _this = null;
	_this = P.admin.jsll.ppt = {
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
			_this.pid = '1401';	
			_this.initEvent();
			_this.initTopic();
			_this.initUploader();
		},
		initEvent : function(){
			$('body').on('click', '.add', _this.onAddPPT);
			$('body').on('click', '.del', _this.onDelPPT);
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
		},
		initTopic : function() {
			var searchUrl =  'menu/tree/1401';
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
			var searchUrl = 'article/queryArticleByMenu';
			var data = _this.data.searchData;
			data.mid = 1401;
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
					$('#tree_content_title').val(_this.currNode.name);
					$('#ppt_path').val(_this.currNode.org_path);
					$('#btn_download').attr('href',_this.currNode.file_name);
					if(_this.currNode.org_path){
						$('#btn_upload').text('修改文件');
					}
					
					PDFObject.embed('uploads/'+ _this.currNode.view_name, "#ppt_pdf");
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
		onAddPPT : function(){
			_this.id = '';
			$('#ppt_path').val('');
			$('#tree_content_title').val('');
			$('#ppt_pdf').html('');	
			$('#btn_download').attr('href', 'javascript:void(0)');
			$('#btn_upload').text('上传文件');	
			
		},
		onDelPPT : function(){
			var id = _this.id;
			if(!id){
				util.dialog.infoDialog('请选择要删除的栏目');
				return;
			}
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
								_this.initTopic();
								$('#ppt_path').val('');
								$('#tree_content_title').val('');
								$('#ppt_pdf').html('');	
								$('#btn_download').attr('href', 'javascript:void(0)');
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
				url : '/upload/file',
				flash_swf_url : 'js/lib/plupload/plupload.flash.swf',// plupload.flash.swf文件所在路径
				multi_selection : false,
				filters: [
				     {title: "允许文件类型", extensions: 'ppt,pptx'}
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
		save : function() {
			var fileName = _this.fileName;
			if(fileName.indexOf('/uploads/') != -1){
				fileName = fileName.split('/uploads/')[1];
			}
			var postData = {
				title : $('#tree_content_title').val(),
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