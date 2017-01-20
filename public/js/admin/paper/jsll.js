(function(P){
	var _this = null;
	_this = P.admin.paper.jsll = {
		searchUrl : 'article/queryArticleByMenu',
		treeUrl : 'jsll/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		data : {
			image : 'jpg,png,gif,jpeg,bmp',
			initData : null,
			initCallback : null,
			searchData : {
				pageNo : 1,
				pageSize : 10
			}
		},
		init : function() {
			_this.txt_editor = $('#content');
			_this.initEvent();
			$('#list_panel').hide();
			$('#tree_panel').show();
			_this.initTopic();
		},
		initEvent : function(){
			$('#btn_commit').on('click', _this.commitInfo);
			$('.btn-show').on('click', _this.show);
			$('.btn-hide').on('click', _this.hide);
		},
		initTopic : function(subjectId) {
			$.ajax({
				type : "get",
				cache : false,
				url : 'admin/paper/jsll/hide',
				success : function(result){
					if(!result.success){
						util.dialog.infoDialog('网络异常');
					}else{
						var idsArr = result.ids.split(',');
						var length = idsArr.length;
						var hideMap = {};
						for(var i=0;i<length;i++){
							hideMap[idsArr[i]] = true;
						}
						_this.hideMap = hideMap;
						$.ajax({
							type : "post",
							cache : false,
							url : 'resource/info/list',
							dataType : 'json',
							beforeSend : function() {
								$('#topic_tree').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><div style="color:#999999;display:inline-block;font-size:12px;margin-left:5px;vertical-align:bottom;">载入中...</div></div>');
							},
							success : _this.handleTopic 
						});
					}
				}
			});
		},
		handleTopic : function(data) {
			_this.topicNodes = [];
			var list = data.data.list;
			for(var index in list){
				var menu = list[index];
				if(menu.id == 100){
					continue;
				}
				menu['pId'] = menu.parent_id;
				if(_this.hideMap[menu.id]){
					menu.isHidden = true;
					menu.checked = true;
				}
				_this.topicNodes.push(menu);
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
					pIdKey : "pId",// 父节点id 自定义
					rootPId : ""
				}
			},
			check : {
				enable : true,
				chkboxType: { "Y": "", "N": "" }
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
				onRightClick : function(event,treeId, treeNode){
					console.log(treeNode);
				},
				onCheck : function(){
					var zTree = _this.getCurrTree();
					var nodes = zTree.getCheckedNodes(true);
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
					$('#txt_title').val(_this.currNode.name);
					if(_this.currNode.content){
						if(_this.currNode.content == 'null'){
							_this.currNode.content == '';
						}
						// $('#content').html('<pre>' + _this.currNode.content + '</pre>');		
						$('#content').html(_this.currNode.content);	
					}else{
						$.ajax({
							url : 'resource/info/detail/' + _this.currNode.id,
							type : 'get',
							async : false,
							success : function(data){
								if(data.success){
									if(data.data.content == 'null'){
										data.data.content == '';
									}
									// $('#content').html('<pre>' + data.data.content + '</pre>');	
									_this.currNode.content = data.data.content;
									$('#content').html(_this.currNode.content);	
								}else{
									$('#content').html('');			
								}
							}
						});
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
		show : function(){
			var zTree = _this.getCurrTree();
			var nodes = zTree.getNodes();
			zTree.showNodes(nodes);
		},
		hide : function(){
			var zTree = _this.getCurrTree();
			var nodes = zTree.getCheckedNodes(true);
			var idsArr = [];
			for(var index in nodes){
				idsArr.push(nodes[index].id);
			}
			util.dialog.loadingDialog('正在提交请稍等', function(dd){
				$.ajax({
					url : 'admin/paper/jsll/hide',
					type: 'post',
					data: {ids: idsArr.join(',')},
					success : function(){
						zTree.hideNodes(nodes);				
					},
					complete : function(){
						dd.close();
					}
				});
			});
		},
		commitInfo : function() {
			var id = _this.currNode.id
			var name = $('#txt_title').val();
			var content = _this.txt_editor.val();
			
			var postData = {
				content : content,
				id : id
			};
			$.ajax({
				url : 'admin/jsll/updateinfo',
				type : 'post',
				data : postData,
				success : function(data){
					util.dialog.infoDialog('提交成功');
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		}
	};
}(moka));