(function(P){
	var _this = null;
	_this = P.user.jsjn.list = {
		pid : 14,//系统根目录编号
		type : 1,
		searchUrl : 'jsjn/list',
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
				pageSize : 10000
			}
		},
		init : function() {
			$('#hd_menu_resource').addClass('current');
			_this.data.picTpl = juicer($('#pic_tpl').html());
			_this.data.videoTpl = juicer($('#video_tpl').html());
			_this.data.pptTpl = juicer($('#ppt_tpl').html());

			
			_this.initEvent();
			_this.initTopic();
			$('.type-panel').find('li').first().addClass('active');
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

			$('.type-panel').on('click', 'li',function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				_this.type = $this.attr('data-type');
				_this.initTopic();
			});
		},
		initResource : function(){
			
		},
		initTopic : function() {
			var searchUrl = 'jsjn/list';
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
								if(menu.menu_id == 1437){
									console.log(menu);
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
					$('#content_title').html(_this.currNode.name);
					if(_this.type == 1){
						if(_this.currNode.content){
							if(_this.currNode.content == 'null'){
								_this.currNode.content == '';
							}
							$('#content').html('<pre>' + _this.currNode.content + '</pre>');		
						}else{
							$.ajax({
								url : 'jsjn/info/' + _this.currNode.id,
								type : 'get',
								async : false,
								success : function(data){
									if(data.success){
										if(data.data.content == 'null'){
											data.data.content == '';
										}
										$('#content').html('<pre>' + data.data.content + '</pre>');		
										_this.currNode.content = data.data.content;

									}else{
										$('#content').html('');			
									}
								}
							});
						}
					}
					if(_this.type == 2){
						if( _this.currNode.file_name){
							$('#content').html(_this.data.picTpl.render(_this.currNode));
						}else{
							$('#content').html('');			
						}
						
					}

					if(_this.type == 3 ){
						if( _this.currNode.file_name){
							$('#content').html(_this.data.videoTpl.render(_this.currNode));
						}else{
							$('#content').html('');			
						}
					}

					if(_this.type == 4 ){
						if( _this.currNode.file_name){
							$('#content').html(_this.data.pptTpl.render(_this.currNode));
						}else{
							$('#content').html('');			
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
		}
	};
}(moka));