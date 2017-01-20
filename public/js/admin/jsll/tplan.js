(function(P){
	var _this = null;
	_this = P.admin.jsll.tplan = {
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
			_this.pid = 3532;
			_this.tpl.menuTpl = juicer($('#menu_tpl').html());
			_this.txt_editor = $('#txt_editor');
			_this.initEvent();
			_this.initTopic();
		},
		initEvent : function(){
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
			$('#btn_txt').on('click', _this.save);
		},
		initTopic : function() {
			var searchUrl =  'jsll/info/list/tplan';
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
			_this.id = '';
			_this.type = '教案';
			$('#tree_content_title').val('');
			$('#txt_editor').val('');
		},
		onDel : function(){
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
						url : 'admin/jsjn/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								_this.initTopic();
								$('#tree_content_title').val('');
								$('#txt_editor').val('');
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
			postData = {
				content : $('#txt_editor').val(),
				title : $('#tree_content_title').val()
			};
			if(_this.id){
				postData.id = _this.id;
			}else{
				postData.type = _this.type;
				postData.pid = _this.pid;
			}
			$.ajax({
				url : 'admin/jsjn/save',
				type : 'post',
				data : postData,
				success : function(data){
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