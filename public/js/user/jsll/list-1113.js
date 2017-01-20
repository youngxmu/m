(function(P){
	var _this = null;
	_this = P.user.jsll.list = {
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
			_this.data.picTpl = juicer($('#pic_tpl').html());
			_this.data.videoTpl = juicer($('#video_tpl').html());
			_this.data.pptTpl = juicer($('#ppt_tpl').html());
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.initEvent();
			_this.type = 1;
			_this.data.type = '政策';
			_this.search();
		},
		initEvent : function(){
			$('.nav-ul').on('click', 'li', _this.changeType);
			$('#menu_panel').on('click', 'li', _this.showContent);

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


			$('body').on('keydown','#keyword',function(e){
		        var event = window.event || e;
		        if(event.keyCode == 13){
		          	_this.data.searchData.keyword = $('#keyword').val();
					_this.search();
		        }
		    });
			$('#btn_search').click(function(){
				_this.data.searchData.keyword = $('#keyword').val();
				_this.search();
			});


			$('.type-panel').on('click', 'li',function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				_this.type = $this.attr('data-type');
				console.log(_this.type);
				_this.initTopic();
			});
		},
		changeType : function(){
			var $this = $(this);
			$this.addClass('active').siblings().removeClass('active');
			_this.data.type = $this.attr('data-type');
			$('#main_panel').hide();
			$('#p_tree_panel').hide();
			$('#tree_panel').hide();
			if(_this.data.type == '资料'){
				$('#tree_panel').show();
				_this.initTopic();
			}else if(_this.data.type == '理论'){
				$('#p_tree_panel').show();
				_this.initPTopic();
			}else{
				$('#main_panel').show();
				_this.search();
			}
		},
		search : function(){
			$.ajax({
				url : 'jsll/list/' + _this.data.type,
				type : 'post',
				success : function(result){
					if(result.success){
						var html = _this.tpl.menuTpl.render(result.data);
						$('#menu_panel').html(html);
						_this.listMap = {};
						for(var index in result.data.list){
							var item = result.data.list[index];
							_this.listMap[item.id] = item;
							if(index == 0){
								$('#content_title').html(item.title);
								$('#content').html(item.content);
							}
						}
					}else{
						$('#menu_panel').html('');
						$('#content').html('');			
					}
				}
			});
		},
		showContent : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			
			var item = _this.listMap[id];

			$('#content_title').html(item.title);
			$('#content').html(item.content);
		},
		initTopic : function() {
			var searchUrl = 'jsll/info/list';
			if(_this.type == 2){
				searchUrl =  'menu/tree/1403';
			}
			if(_this.type == 3){
				searchUrl =  'menu/tree/1402';
			}
			if(_this.type == 4){
				searchUrl =  'menu/tree/1401';
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
				if(menu.title && !menu.name){
					menu.name = menu.title;	
				}
				// menu['pId'] = menu.parent_id;
				_this.topicNodes.push(menu);
			}

			if(_this.type > 1){
				var searchUrl = 'article/queryArticleByMenu';
				var data = _this.data.searchData;
				if(_this.data.keyword){
					searchUrl = 'article/queryArticleByTitle';
				}else{
					searchUrl = 'article/queryArticleByMenu';
				}

				
				if(_this.type == 2){
					data.mid = 1403;
				}
				if(_this.type == 3){
					data.mid = 1402;
				}
				if(_this.type == 4){
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
					var $title = $('#tree_panel .panel-title');
					var $body = $('#tree_panel .panel-body');
					$title.html(_this.currNode.name);
					if(_this.type == 1){
						if(_this.currNode.content){
							if(_this.currNode.content == 'null'){
								_this.currNode.content == '';
							}
							$body.html('<pre>' + _this.currNode.content + '</pre>');		
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
										$body.html('<pre>' + data.data.content + '</pre>');		
										_this.currNode.content = data.data.content;

									}else{
										$body.html('');			
									}
								}
							});
						}
					}
					if(_this.type == 2){
						if( _this.currNode.file_name){
							$body.html(_this.data.picTpl.render(_this.currNode));
						}else{
							$body.html('');
						}
						
					}

					if(_this.type == 3 ){
						if( _this.currNode.file_name){
							$body.html(_this.data.videoTpl.render(_this.currNode));
						}else{
							$body.html('');
						}
					}

					if(_this.type == 4 ){
						if( _this.currNode.file_name){
							$body.html(_this.data.pptTpl.render(_this.currNode));
						}else{
							$body.html('');			
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







		initPTopic : function() {
			var searchUrl = 'jsll/list/理论';
			$.ajax({
				type : "post",
				cache : false,
				url : searchUrl,
				dataType : 'json',
				beforeSend : function() {
					$('#p_topic_tree').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><div style="color:#999999;display:inline-block;font-size:12px;margin-left:5px;vertical-align:bottom;">载入中...</div></div>');
				},
				success : _this.handlePTopic 
			});
		},
		handlePTopic : function(data) {
			_this.topicNodes = [];
			var list = data.data.list;
			for(var index in list){
				var menu = list[index];
				if(menu.title && !menu.name){
					menu.name = menu.title;	
				}
				// menu['pId'] = menu.parent_id;
				_this.topicNodes.push(menu);
			}
			_this.initPTree();
		},
		pSetting : {
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
					pIdKey : "pid",// 父节点id 自定义
					rootPId : 14
				}
			},
			check : {
				enable : false
			},
			callback : {
				beforeClick : function(treeId, treeNode) {
					var zTree = _this.getCurrPTree();
					if (treeNode.isParent) {
						zTree.expandNode(treeNode);
						return true;
					} else {
						return true;
					}
				},
				onClick: function(event,treeId, treeNode) {
					var zTree = _this.getCurrPTree();
					var nodes = zTree.getCheckedNodes(true);
					if(_this.currNode && _this.currNode.id == treeNode.id){
						zTree.cancelSelectedNode(treeNode);
						_this.currNode = null;
						return false;
					}
					_this.currNode = treeNode;
					var $title = $('#p_tree_panel .panel-title');
					var $body = $('#p_tree_panel .panel-body');
					$title.html(_this.currNode.name);
					if(_this.currNode.content){
						if(_this.currNode.content == 'null'){
							_this.currNode.content == '';
						}
						$body.html('<pre>' + _this.currNode.content + '</pre>');		
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
									$body.html('<pre>' + data.data.content + '</pre>');		
									_this.currNode.content = data.data.content;

								}else{
									$body.html('');			
								}
							}
						});
					}
					return true;
				}
			}
		},
		initPTree : function() {// 初始化树功能，折叠展开点击事件
			var topicTree = $("#p_topic_tree");
			topicTree = $.fn.zTree.init(topicTree, _this.pSetting, _this.topicNodes);
			_this.topicTree = $.fn.zTree.getZTreeObj("p_topic_tree");
		},
		getCurrPTree : function(){
			return _this.topicTree;
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
		}
		
	};
}(moka));