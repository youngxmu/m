(function(P){
	var _this = null;
	_this = P.admin.jsll.list = {
		pid : 1302,//系统根目录编号
		searchUrl : 'admin/jsll/list3',
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

			$('.resource-opr').on('click', '.add',function(){
				var zTree = _this.getCurrTree();
				_this.showAddArticle();
			});
			$('body').on('keydown','#keyword',function(e){
		        var event = window.event || e;
		        if(event.keyCode == 13){
		          	_this.data.searchData.keyword = $('#keyword').val();
					_this.searchResource();
		        }
		    });
			$('#btn_search').click(function(){
				_this.data.searchData.keyword = $('#keyword').val();
				_this.searchResource();
			});
		},
		initTopic : function() {
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
					if(_this.currNode.content){
						$('#content').html(_this.currNode.content);		
					}else{
						$.ajax({
							url : 'admin/jsll/info3/' + _this.currNode.id,
							type : 'get',
							async : false,
							success : function(data){
								if(data.success){
									$('#content').html(data.data.content);		
									_this.currNode.content = data.data.content;

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
		showAddMenuDlg : function(){
			var data = {name : ''};
			var d = dialog({
			    title: '添加',
			    content: _this.data.editMenuDlgTpl.render(data),
			    okValue : '确认',
     	        ok : _this.addMenu,
     	        cancelValue : '取消',
     	        cancel : function(){}
			});
			d.showModal();	
		},
		showEditMenuDlg : function(){
			var pmenu = _this.currNode;
			console.log(pmenu);
			var data = {name : pmenu.name,
				content : pmenu.content
			};

			var d = dialog({
			    title: '确认修改',
			    content: _this.data.editMenuDlgTpl.render(data),
			    okValue : '确认',
     	        ok : _this.updateMenu,
     	        cancelValue : '取消',
     	        cancel : function(){}
			});
			d.showModal();	
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
			var mlevel = 1;
			if(pmenu){
				mlevel = pmenu.mlevel + 1;
				parent_id = pmenu.id;
			}

			var name = $('#info_name').val();
			var content = $('#info_content').val();
			if(!name){
				return false;
			}

			var node = {
				mlevel : mlevel,
				parent_id : parent_id,
				name : name,
				content : content
			};

			$.ajax({
				type : "post",
				cache : false,
				url : 'admin/jsll/addinfo3',
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
				mlevel : pmenu.mlevel,
				parent_id : pmenu.parent_id,
				name : name,
				content : content
			};

			$.ajax({
				type : "post",
				cache : false,
				url : 'admin/jsll/updateinfo3',
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
				url : 'admin/jsll/delinfo3',
				data : node,
				success : function(result){
					if(result.success){
						_this.getCurrTree().removeNode(pmenu);
						_this.initTopic();
					}
					
				}
			});
		},
		getMenuPath : function(node){
			var menuArr = [];
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
		showAddArticle : function(){
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('article/edit?menuPath=' + menuPath);
		}
	};
}(moka));