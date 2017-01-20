(function(P){
	var _this = null;
	_this = P.admin.article.listres = {
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		init : function() {
			_this.pid = 3533;
			_this.txt_editor = $('#content');
			_this.initTopic();
			_this.initEvent();
		},
		initEvent : function(){
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
			$('body').on('click', '.add',_this.onAdd);
			$('body').on('click', '.del',_this.onDel);
			$('#btn_commit').on('click', _this.save);
		},
		initTopic : function(subjectId) {
			$.ajax({
				type : "post",
				cache : false,
				url : 'jsll/info/list/other',
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
				if(menu.title == '其它'){
					continue;
				}
				menu['pId'] = menu.parent_id;
				menu.name = menu.title;
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
					console.log(treeNode);
					_this.id = _this.currNode.id;
					$('#txt_title').val(_this.currNode.name);
					if(_this.currNode.content){
						if(_this.currNode.content == 'null'){
							_this.currNode.content == '';
						}
						$('#content').html(_this.currNode.content);	
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
		onAdd : function(){
			_this.id = '';
			_this.type = '其它';
			$('#txt_title').val('');
			$('#content').val('');
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
								$('#txt_title').val('');
								$('#content').val('');
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
				type : '其它',
				content : $('#content').val(),
				title : $('#txt_title').val()
			};
			postData.pid = _this.pid;
			
			if(_this.id){
				postData.id = _this.id;
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