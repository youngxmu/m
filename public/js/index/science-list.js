(function(P){
	var _this = null;
	_this = P.index.science = {
		searchUrl : 'index/science/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		data : {
			searchData : {
				pageNo : 1,
				pageSize : 10
			}
		},
		init : function() {
			_this.mid = $('#mid').val();
			console.log(_this.mid);
			_this.data.searchData.moduleId = _this.mid;
			_this.data.scienceourceTpl = juicer($('#scienceource-tpl').html());
			_this.data.topListTpl = juicer($('#top-scienceource-tpl').html());
			_this.initEvent();
			_this.searchResource();
		},
		initEvent : function(){
			$('#scienceource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.scienceourceList[id];
				var options = {isPreview : false, scienceourceType : 2};
			});
		},
		searchResource : function() {
			$.ajax({
				type : "post",
				url : _this.searchUrl,
				data : _this.data.searchData,
				beforeSend : function() {
					$('#scienceource_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
				},
				success : _this.initPageResource
			});
		},
		initPageResource : function(data) {
			if (!data.success) {
				util.dialog.infoDialog('查询出错');
				return;
			}
	
			_this.data.scienceourceList = {};
			for ( var index in data.list) {
				var scienceource = data.list[index];
				_this.data.scienceourceList[scienceource.id] = scienceource;
			}
			data = data.data;
			var totalPage = data.totalPage;
			var totalcount = data.totalCount;
			var html = _this.data.scienceourceTpl.render(data);
			if(totalcount == 0){
				html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
			}
			$('#scienceource_list').html(html);
			
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
							if (_this.instance_scienceource == null)
								_this.instance_scienceource = this;
							var data = _this.data.searchData;
							$.ajax({
								type : "post",
								url : _this.searchUrl,
								data : data,
								beforeSend : function() {
									$('#scienceource_list').html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
								},
								success : function(data){
									if (!data.success) {
										util.dialog.infoDialog('查询出错');
										return;
									}
							
									_this.data.scienceourceList = {};
									for ( var index in data.list) {
										var scienceource = data.list[index];
										_this.data.scienceourceList[scienceource.id] = scienceource;
									}
									data = data.data;
									var totalPage = data.totalPage;
									var totalcount = data.totalCount;
									var html = _this.data.scienceourceTpl.render(data);
									if(totalcount == 0){
										html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
									}
									$('#scienceource_list').html(html);
								}
							});
						}
					});
				});
			}
		}
	};
}(moka));