(function(P){
	var _this = null;
	_this = P.admin.article.infolist = {
		searchUrl : 'resource/info/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		tpl : {},
		data : {
		},
		init : function() {
			_this.data.editMenuDlgTpl = juicer($('#edit_menu_dlg').html());
			_this.initEvent();
			_this.initTopic();
		},
		initEvent : function(){
			$('#menu_list').on('click', 'li', _this.showContent);
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
			$('#btn_commit').on('click', _this.commitInfo);


			$('.tree-opr').on('click', '.add',function(){
				var zTree = _this.getCurrTree();
				_this.showAddMenuDlg();
			});

			$('.tree-opr').on('click', '.edit',function(){
				var zTree = _this.getCurrTree();
				_this.showEditMenuDlg();
			});

			$('.tree-opr').on('click', '.del',function(){
				var zTree = _this.getCurrTree();
				_this.showDelMenuDlg();
			});
		},
		showContent : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var item = _this.listMap[id];
			_this.currItem = item;
			$('#content').val(item.content);
		},
		initTopic : function() {
			$('#menu_panel').hide();
			$('#tree_panel').show();
			$.ajax({
				type : "post",
				cache : false,
				url : _this.searchUrl,
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
				// menu['pId'] = menu.parent_id;
				if(menu.parent_id != 10){
					_this.topicNodes.push(menu);
				}
			}
			_this.initTree();
		},
		setting : {
			view : {
				dblClickExpand : false,
				showLine : true,
				selectedMulti : false,
				showIcon : true
			},
			data : {
				simpleData : {
					enable : true,
					idKey : "id",// id 自定义
					pIdKey : "parent_id",// 父节点id 自定义
					rootPId : 14
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
					$('#content_title').html(_this.currNode.name);
					if(_this.currNode.content){
						$('#content').val(_this.currNode.content);		
					}else{
						$.ajax({
							url : 'resource/info/detail/' + _this.currNode.id,
							type : 'get',
							async : false,
							success : function(data){
								if(data.success){
									$('#content').val(data.data.content);
									_this.currNode.content = data.data.content;

								}else{
									$('#content').val('');			
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
		commitInfo : function() {
			var currNode = _this.currNode;
			var postData = {
				content : $('#content').val(),
				name : currNode.name,
				id : currNode.id
			};
			$.ajax({
				url : 'admin/jsll/update',
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
		getCurrTree : function(){
			return _this.topicTree;
		},

		showAddMenuDlg : function(){
			var data = {name : ''};
			util.dialog.confirmDialog(
				_this.data.editMenuDlgTpl.render(data),
				_this.addMenu,
				function(){},
				'确认添加菜单'
			);
		},
		showEditMenuDlg : function(){
			var pmenu = _this.currNode;
			console.log(pmenu);
			var data = {name : pmenu.name};
			util.dialog.confirmDialog(
				_this.data.editMenuDlgTpl.render(data),
				_this.updateMenu,
				function(){},
				'确认修改菜单'
			);
		},
		showDelMenuDlg : function(){
			util.dialog.confirmDialog(
				'确认删除',
				_this.delMenu,
				function(){},
				'确认删除菜单'
			);
		},
		addMenu : function(){
			var pmenu = _this.currNode;
			var parent_id = 10;
			if(pmenu){
				parent_id = pmenu.id;
			}

			var name = $('#info_name').val();
			var content = '';//$('#info_content').val();
			if(!name){
				return false;
			}

			var node = {
				parent_id : parent_id,
				name : name,
				content : content
			};

			$.ajax({
				type : "post",
				cache : false,
				url : 'admin/jsll/add',
				data : node,
				success : function(result){
					if(result.success){
						node.id = result.data.insertId;
					}
					// _this.getCurrTree().addNodes(_this.currNode, -1, node, true);

					_this.initTopic();
				}
			});
		},
		updateMenu : function(){
			var pmenu = _this.currNode;

			var name = $('#info_name').val();
			var content = $('#info_content').val();
			
			if(!name){
				return false;
			}

			var node = {
				id : pmenu.id,
				parent_id : pmenu.parent_id,
				name : name,
				content : content
			};

			$.ajax({
				type : "post",
				cache : false,
				url : 'admin/jsll/update',
				data : node,
				success : function(result){
					if(result.success){
						pmenu.name = name;
						_this.getCurrTree().updateNode(pmenu);
						_this.initTopic();
					}
					
				}
			});
		},
		delMenu : function(){
			var pmenu = _this.currNode;
			var node = {
				id : pmenu.id
			};

			$.ajax({
				type : "post",
				cache : false,
				url : 'admin/jsll/del',
				data : node,
				success : function(result){
					if(result.success){
						_this.getCurrTree().removeNode(pmenu);
						_this.initTopic();
					}
					
				}
			});
		},
	};
}(moka));