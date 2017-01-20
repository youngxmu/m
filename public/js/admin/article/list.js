(function(P){
	var _this = null;
	_this = P.admin.article.list = {
		pid : 1102,//系统根目录编号
		searchUrl : 'article/queryArticleByMenu',
		treeUrl : 'jsll/list',
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
			_this.txt_editor = $('#content');
			_this.initEvent();
			var $tab = $('.nav-tabs li.active');
			_this.pid = $tab.attr('data-id');
			_this.searchResource();
		},
		initEvent : function(){
			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
			});

			$('.resource-opr').on('click', '.add',function(){
				var zTree = _this.getCurrTree();
				_this.showAddArticle();
			});
			$('body').on('click', '.oper .del',_this.showDelArticle);

			$('body').on('click', '.nav-tabs li', function(){
				var $this = $(this);
				$this.addClass('active').siblings('li').removeClass('active');
				var pid = $this.attr('data-id');
				var type = $this.attr('data-type');
				_this.pid = pid;
				if(pid){
					_this.searchResource();	
				}
			});
			$('#btn_commit').on('click', _this.commitInfo);
			$('#btn_create').on('click', _this.create);
		},
		searchResource : function() {
			_this.data.searchData.mid = _this.pid;
			$.ajax({
				type : "post",
				url : _this.searchUrl,
				data : _this.data.searchData,
				beforeSend : function() {
					$('#article_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
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
			$('#article_list').html(html);
			
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
						currentPage : _this.data.searchData.pageNo,
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
									$('#article_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
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
									$('#article_list').html(html);
								}
							});
						}
					});
				});
			}
		},
		showAddArticle : function(){
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/upload?menuPath=' + menuPath);
		},
		showDelArticle : function(){
			var id = $(this).attr('data-id');
			console.log(id);
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/article/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								util.dialog.toastDialog('删除成功');
								_this.searchResource();
							}else{
								alert(result.msg);
							}
							
						}
					});
				},
				function(){},
				'确认删除'
			);
		}
	};
}(moka));