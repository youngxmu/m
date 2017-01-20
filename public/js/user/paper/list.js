(function(P){
	var _this = null;
	_this = P.user.paper.list = {
		// searchUrl : 'paper/list',
		searchUrl : 'jsll/list',
		txtUrl : 'resource/info/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		tpl : {
			paperListTpl : null
		},
		data : {
			paperMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			_this.questionUtils = question;
			_this.tpl.menuTpl = juicer($('#menu_tpl').html());
			// _this.tpl.paperListTpl = juicer($('#paper-list-tpl').html());

			
			_this.tpl.questionTypeTpl = juicer($('#question-type-tpl').html());
			_this.tpl.questionListTpl = juicer($('#question-list-tpl').html());
			_this.initEvent();
			_this.data.type = '理论';
			$('#menu_panel').hide();
				$('#topic_tree').show();
				_this.initTopic();
			// _this.search();
			// _this.search();
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

			$('body').on('click', '.q-type-list .q-type', function(){
				var $this = $(this);
				var id = $this.attr('data-id');
				var question = _this.questionMap[id];
				var html = _this.tpl.questionListTpl.render({list:[question]});
				$('#content_title').html($this.text());
				$('#content').html(html);
			});

		 	$('body').on('click', '#login_submit', function(){
		      	$('#ajax_login_form').ajaxSubmit(function(data){
			        if(_this.data.type == 'test'){
			        	window.location.href=  'paper/detail';
			        }
			        if(_this.data.type == 'history'){
			        	window.location.href=  'paper/history/list';
			        }
		      	});
		    });


		    $('body').on('click', '.showanswer', function(){
				var $this = $(this);
				var $target = $this.siblings('.rtanswer');
				if($this.hasClass('on')){
					$target.hide();
					$this.find('a').text('显示答案');
					$this.addClass('off').removeClass('on');
				}else{
					$target.show();
					$this.find('a').text('隐藏答案');
					$this.addClass('on').removeClass('off');
					
				}
			});

		},
		changeType : function(){
			var $this = $(this);
			$this.addClass('active').siblings().removeClass('active');
			_this.data.type = $this.attr('data-type');
			if(_this.data.type == ''){
				return;
			}
			// if(_this.data.type == '资料'){
			// 	_this.initTopic();
			// }
			if(_this.data.type == '理论'){
				$('#menu_panel').hide();
				$('#topic_tree').show();
				_this.initTopic();
				// _this.search();
			}

			if(_this.data.type == '题库'){
				$('#menu_panel').hide();
				$('#topic_tree').show();
				_this.searchQuestions();
			}

			if(_this.data.type == 'test'){
				$.ajax({
					url : 'auth/user/islogin',
					type : 'post',
					success : function(result){
						if(result.success){
							
							window.location.href=  'paper/detail';
						}else{
							showLogin();
						}
					}
				});
			}

			if(_this.data.type == 'history'){
				$.ajax({
					url : 'auth/user/islogin',
					type : 'post',
					success : function(result){
						if(result.success){
							window.location.href=  'paper/history/list';
						}else{
							showLogin();
						}
					}
				});
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
		searchQuestions : function(){
			var queryData = {
				pageNo : 1,
				pageSize: 2000
			};
			$.ajax({
				url : 'question/list',
				type : 'post',
				data : queryData,
				success : function(result){
					if(result.success){
						var html = _this.tpl.questionTypeTpl.render(result.data);
						$('#topic_tree').html(html);
						_this.questionMap = {};
						for(var index in result.data.list){
							var item = result.data.list[index];
							_this.questionMap[item.id] = item;
							console.log(item);
							if(index == 0){
								var question = item;
								var title = util.formatIndex(index) + '&nbsp;' + _this.questionUtils.getQType(question.qtype);
								var qhtml = _this.tpl.questionListTpl.render({list:[question]});
								$('#content_title').html(title);
								$('#content').html(qhtml);
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
			$('#menu_panel').hide();
			$('#topic_tree').show();
			$.ajax({
				type : "get",
				cache : false,
				url : 'admin/paper/jsll/hide',
				success : function(result){
					if(!result.success){
						util.dialog.infoDialog('网络异常');
					}else{
						var idsArr = result.ids.split(',');
						var length = idsArr.length;
						var hideMap = {};
						for(var i=0;i<length;i++){
							hideMap[idsArr[i]] = true;
						}
						_this.hideMap = hideMap;
						$.ajax({
							type : "post",
							cache : false,
							url : _this.txtUrl,
							dataType : 'json',
							beforeSend : function() {
								$('#topic_tree').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><div style="color:#999999;display:inline-block;font-size:12px;margin-left:5px;vertical-align:bottom;">载入中...</div></div>');
							},
							success : _this.handleTopic 
						});
					}
				}
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
				if(_this.hideMap[menu.id]){
					menu.isHidden = true;
					menu.checked = true;
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
					rootPId : 100
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
						$.ajax({
							url : 'resource/info/detail/' + _this.currNode.id,
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
		},
		getCurrTree : function(){
			return _this.topicTree;
		}
	};
}(moka));

// juicer.register('formatAnswer', moka.user.paper.list.formatAnswer );