(function(P){
	var _this = null;
	_this = P.admin.hbll.list = {
		pid : 16,//系统根目录编号
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
			$('#hd_menu_resource').addClass('current');
			_this.data.editMenuDlgTpl = juicer($('#edit_menu_dlg').html());
			_this.initEvent();
			_this.initTopic();
			_this.initEditor();
		},
		initEditor : function(){
			_this.editor = new Simditor({
			  	textarea: $('#editor'),
			  	upload : {
			    	url: 'upload/img',
				    params: null,
				    fileKey: 'upload_file',
				    connectionCount: 3,
				    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			  	}
			});
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

			$('#btn_save').click(_this.save);
		},
		initTopic : function() {
			$.ajax({
				type : "post",
				cache : false,
				url : 'menu/tree/' + _this.pid,
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
					_this.mid = treeNode.id
					$.ajax({
						url : 'admin/hbll/detail/' + _this.mid,
						success : function(result){
							if(result.success){
								if(result.data){
									_this.editor.setValue(result.data.content);
								}else{
									_this.editor.setValue('');
								}
							}
						}
					});

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
			var parent_id = _this.pid;
			var mlevel = 1;
			if(pmenu){
				mlevel = pmenu.mlevel + 1;
				parent_id = pmenu.id;
			}

			var name = $('#menu_name').val();
			
			if(!name){
				return false;
			}

			var node = {
				mlevel : mlevel,
				parent_id : parent_id,
				name : name
			};

			$.ajax({
				type : "post",
				cache : false,
				url : 'menu/add',
				data : node,
				success : function(result){
					if(result.success){
						node.id = result.data.insertId;
					}
					_this.getCurrTree().addNodes(_this.currNode, -1, node, true);
				}
			});
		},
		updateMenu : function(){
			var pmenu = _this.currNode;
			var name = $('#menu_name').val();
			
			if(!name){
				return false;
			}

			var node = {
				id : pmenu.id,
				mlevel : pmenu.mlevel,
				parent_id : pmenu.parent_id,
				name : name
			};

			$.ajax({
				type : "post",
				cache : false,
				url : 'menu/update',
				data : node,
				success : function(result){
					if(result.success){
						pmenu.name = name;
						_this.getCurrTree().updateNode(pmenu);
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
				url : 'menu/del',
				data : node,
				success : function(result){
					if(result.success){
						_this.getCurrTree().removeNode(pmenu);
					}
					
				}
			});
		},
		getMenuPath : function(node){
			var menuArr = [_this.pid];
			var level = 0;
			if(node == null){
				return '';
			}else{
				level = node.level;
			}
			for(var i=0;i<=level;i++){
				menuArr.push(node.id);
				node = node.getParentNode();
			}
			return menuArr.join(',');
		},

		save : function(){
			if(_this.commiting){
				return util.dialog.toastDialog('正在提交，请稍后');
			}
			_this.commiting = true;
			$.ajax({
				url : 'admin/hbll/save',
				type : 'post',
				data : {
					mid : _this.mid,
					content : _this.editor.getValue()
				},
				success : function(result){
					if(result.success){
						return util.dialog.toastDialog('修改成功');
					}else{
						return util.dialog.toastDialog('修改失败，请重试');
					}
				},
				complete : function(){
					_this.commiting = false;
				}

			});

		}
	};
}(moka));