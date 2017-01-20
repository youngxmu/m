(function(P){
	var _this = null;
	_this = P.user.jsjn.list = {
		pid : 1301,//系统根目录编号
		searchUrl : 'article/queryArticleByMenu',
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
			// $('#hd_menu_resource').addClass('current');
			_this.type = $('#type').val();
			_this.tpl.menuTpl = juicer($('#menu_tpl').html());
			_this.data.picTpl = juicer($('#pic_tpl').html());
			_this.data.videoTpl = juicer($('#video_tpl').html());
			_this.data.pptTpl = juicer($('#ppt_tpl').html());
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.initEvent();
			// _this.initTopic();
			_this.changeType();
			// _this.searchResource();
		},
		initEvent : function(){
			$('.nav-ul').on('click', 'li', _this.changeType);
			$('#menu_panel').on('click', '.res-menu li', _this.showContent);
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
		changeType : function(){
			var $this = $('.nav-ul .' + _this.type);
			var type = $this.attr('data-type');
			var mid = $this.attr('data-mid');
			_this.data.type = $this.attr('data-type');
			$('#tree_panel').hide();
			$('#menu_panel').show();
			$.ajax({
				type : "post",
				url : 'menu/submenu/' + mid,
				success : function(data){
					if(data.success){
						$('.res-menu').html(_this.tpl.menuTpl.render(data.data));
					}else{
						alert(data.msg);
					}
				}
			});
		},
		showContent : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			console.log(id);
			if(id == 130202){
				// return window.open('jsjn/sys');
				return;// window.location.href = 'jsjn/sys';
			}
			$.ajax({
				url : 'jsjn/info/view/' + id,
				type : 'post',
				success : function(result){
					if(result.success){
						$('#content_title').html($this.text());
						$('#content').html(result.data.content);
					}else{
						$('#menu_panel').html('');
						$('#content').html('');			
					}
				}
			});
		},
		search : function(){
			$.ajax({
				url : 'menu/tree/' + _this.pid,
				type : 'post',
				success : function(result){
					if(result.success){
						var html = _this.tpl.menuTpl.render(result.data);
						$('.res-memu').html(html);
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
		searchResource : function() {
			var data = _this.data.searchData;
			if(_this.data.searchData.keyword){
				_this.searchUrl = 'article/queryArticleByTitle';
			}else{
				_this.searchUrl = 'article/queryArticleByMenu';
			}

			if(!_this.data.searchData.mid){
				_this.data.searchData.mid = _this.pid;
			}
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
								url : 'jsjn/info/' + _this.currNode.id,
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