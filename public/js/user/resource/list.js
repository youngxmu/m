(function(P){
	var _this = null;
	_this = P.user.resource.list = {
		pid : 11,
		searchUrl : 'resource/list',
		treeUrl : 'resource/info/list',
		data : {
			searchData : {
				pageNo : 1,
				pageSize : 10
			}
		},
		init : function() {
			_this.type = $('#type').val();
			var keyword = $('#search_title').val();
			if(keyword){
				_this.data.searchData.keyword = keyword;
				$('#keyword').val(keyword);

				var $this = $('.nav-ul li').last();
				$this.addClass('active').siblings('li').removeClass('active');
				$('#menu_panel').show();
				$('#tree_panel').hide();
				$('#res_panel').show();
				$('#info_panel').hide();
				_this.data.searchData.type = '1,6';
				var $type = $('.type-panel li').first();
				$type.addClass('active').siblings().removeClass('active');
				_this.searchResource();
			}
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.initEvent();
			if(_this.type == 'txt'){
				$('#info_panel').show();
				_this.data.searchData.type = '1,6';
				_this.treeUrl = 'resource/info/list';
				_this.initTopic();	
			}else if(_this.type == 'other'){
				$('#info_panel').show();
				_this.treeUrl = 'jsll/info/list/other';
				_this.initTopic();
			}else{
				if(_this.type == 'pic'){
					_this.data.searchData.type = '3';	
				}
				if(_this.type == 'video'){
					_this.data.searchData.type = '4';
				}
				if(_this.type == 'ppt'){
					_this.data.searchData.type = '0';
				}
				_this.searchResource();	
			}
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


			// $('body').on('click','.nav-ul li',function(){
			// 	var $this = $(this)
			// 	var type = $this.attr('data-type');
			// 	if(type == 1){
			// 		_this.data.searchData.type = '1,6';
			// 	}
			// 	if(type == 2){
			// 		_this.data.searchData.type = '3';	
			// 	}
			// 	if(type == 3){
			// 		_this.data.searchData.type = '4';
			// 	}
			// 	if(type == 4){
			// 		_this.data.searchData.type = '0';
			// 	}

			// 	$this.addClass('active').siblings().removeClass('active');
			// 	_this.data.searchData.pageNo = 1;
			// 	_this.searchResource();
			// });

			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
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

			// $('.nav-ul').on('click', 'li', function(){
			// 	var $this = $(this);
			// 	$this.addClass('active').siblings('li').removeClass('active');
			// 	if($this.hasClass('info')){
			// 		$('#menu_panel').hide();
			// 		$('#tree_panel').show();
			// 		$('#res_panel').hide();
			// 		$('#info_panel').show();
			// 		_this.initTopic();
			// 	}else{
			// 		$('#menu_panel').show();
			// 		$('#tree_panel').hide();
			// 		$('#res_panel').show();
			// 		$('#info_panel').hide();
			// 		_this.data.searchData.type = '1,6';
			// 		var $type = $('.type-panel li').first();
			// 		$type.addClass('active').siblings().removeClass('active');
			// 		_this.searchResource();
			// 	}
			// });
			
		},
		searchResource : function() {
			var data = _this.data.searchData;
			$.ajax({
				type : "post",
				url : _this.searchUrl,
				data : data,
				beforeSend : function() {
					$('#resource_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
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
				html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
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
							var data = _this.data.searchData;
							$.ajax({
								type : "post",
								url : _this.searchUrl,
								data : data,
								beforeSend : function() {
									$('#resource_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
								},
								success : function(data){
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
										html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
									}
									$('#resource_list').html(html);
								}
							});
						}
					});
				});
			}
		},
		initTopic : function() {
			$.ajax({
				type : "post",
				cache : false,
				url : _this.treeUrl,
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
				if(menu.title && !menu.name){
					menu.name = menu.title;	
				}
				if( menu.name == '其它'){
					continue;
				}
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
					console.log(_this.currNode.id);
					$('#content_title').html(_this.currNode.name);
					if(_this.currNode.content){
						$('#content').html(_this.currNode.content);		
					}else{
						var url = 'resource/info/detail/' + _this.currNode.id;
						if(_this.type == 'other'){
							url = 'jsll/info/detail/' + _this.currNode.id;
						}
						$.ajax({
							url : url,
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

			var node = topicTree.getNodeByParam('id','10008');
			topicTree.removeNode(node);
			// topicTree.selectNode(node);
			// _this.currNode = node;

			// $('#content_title').html(_this.currNode.name);
			// if(_this.currNode.content){
			// 	$('#content').html(_this.currNode.content);		
			// }else{
			// 	$.ajax({
			// 		url : 'resource/info/detail/' + _this.currNode.id,
			// 		type : 'get',
			// 		async : false,
			// 		success : function(data){
			// 			if(data.success){
			// 				$('#content').html(data.data.content);
			// 				_this.currNode.content = data.data.content;

			// 			}else{
			// 				$('#content').html('');			
			// 			}
			// 		}
			// 	});
			// }
		},
		getCurrTree : function(){
			return _this.topicTree;
		}
	};
}(moka));