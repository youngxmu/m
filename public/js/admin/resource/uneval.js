(function(P){
	var _this = null;
	_this = P.article.uneval = {
		searchUrl : 'admin/article/uneval',
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
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.data.editMenuDlgTpl = juicer($('#edit_menu_dlg').html());
			_this.initEvent();
			_this.initTopic();
			_this.searchResource();
		},
		initEvent : function(){
			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
			});
			
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
				console.log(1);
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
		initTopic : function(subjectId) {
			$.ajax({
				type : "post",
				cache : false,
				url : 'menu/tree',
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
				menu['pId'] = menu.parent_id;
				_this.topicNodes.push(menu);
			}
			_this.initTree();
		},
		searchResource : function() {
			var data = _this.data.searchData;
			$.ajax({
				type : "post",
				url : _this.searchUrl,
				data : data,
				beforeSend : function() {
					$('#resource_list').html('<div style="text-align:center;margin-top:20px;font-size:12px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
				},
				success : _this.initPageResource 
			});
		},
		initPageResource : function(data) {
			if (!data.success) {
				util.dialog.infoDialog('查询出错');
				return;
			}
	
			_this.data.resourceList = {};
			for ( var index in data.list) {
				var resource = data.list[index];
				_this.data.resourceList[resource.id] = resource;
			}
			data = data.data;
			var totalPage = data.totalPage;
			var totalcount = data.totalCount;
			var html = _this.data.resourceTpl.render(data);
			if(totalcount == 0){
				html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;font-size:12px;">当前条件下搜索，获得0条结果!</div>';
			}
			$('#resource_list').html(html);
			
			if (totalPage <= 1) {
				$("#pagebar").html('');
			}
			if (totalPage >= 2) {
				$(function() {
					$.fn.jpagebar({
						renderTo : $("#pagebar"),
						totalpage : totalPage,
						totalcount : totalcount,
						pagebarCssName : 'pagination2',
						currentPage : data.currentPage,
						onClickPage : function(pageNo) {
							$.fn.setCurrentPage(this, pageNo);
							_this.data.searchData.pageNo = pageNo;
							if (_this.instance_resource == null)
								_this.instance_resource = this;
							_this.searchResource();
						}
					});
				});
			}
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
					_this.currNode = treeNode;
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
					_this.data.searchData.mid = treeNode.id;
					_this.data.searchData.pageNo = 1;
					_this.searchResource();
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
			var parent_id = 0;
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
					console.log('reload');
					if(result.success){
						node.id = result.data.insert_id;	
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
						console.log(node);
						pmenu.name = name
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
		}
	};
}(moka));