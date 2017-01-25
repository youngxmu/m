(function(P){
	var _this = null;
	_this = P.admin.sort = {
		searchUrl : 'index/list/res',
		tpl : {},
		data : {
			searchData : {
				moduleId : 1,
				pageNo : 1,
				pageSize : 20
			}
		},
		init : function() {
			var moduleId = $('#id').val();
			_this.data.searchData.moduleId = moduleId;
			var tabIndex = parseInt(moduleId) - 1;
			$('.nav-tabs li').first().addClass('active');

			_this.tpl.sortListTpl = juicer($('#sort-list-tpl').html());
			_this.tpl.resListTpl = juicer($('#res-list-tpl').html());
			_this.initEvent();
			_this.$sortPanel = $('#res_sort_list');
			_this.$panel = $('#res_list');
			_this.$pagebar = $('#res_pagebar');
			_this.loadTop();
			_this.loadSortList();
			_this.loadResList();
		},
		initEvent : function(){
			// $('body').on('click', '.add-key', _this.add);
			// $('body').on('click', '.del-key', _this.del);
			$("#res_sort_list").dragsort({ 
				dragSelector: "li", 
				dragBetween: true, 
				dragEnd: _this.saveOrder, 
				placeHolderTemplate: '<li class="list-group-item"><span class="sort-title"><span class="sort-index"></span>&nbsp;</span><span class="sort-del"><span class="glyphicon glyphicon-trash"></span></span></li>'
			});
		},
		saveOrder : function(){
			console.log(1);
		},
		loadTop : function(){
			$.ajax({
				type : 'post',
				url : 'index/res/up',
				async : false,
				data : {mid:_this.data.searchData.moduleId},
				success : function(result){
					var data = result.data;
					_this.topMap = {};
					for(var index in data.list){
						var top = data.list[index];
						_this.topMap[top.id] = top;
					}
				}
			});
		},
		loadSortList : function(id){
			var data = _this.data.searchData;
			$.ajax({
				type : "post",
				url : 'index/res/list',
				data : data,
				beforeSend : function() {
					_this.$sortPanel.html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
				},
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog('网络异常请重试！');
					}
					var data = result.data;
					var html = _this.tpl.sortListTpl.render(data);
					if(data.totalCount == 0){
						html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前未设置排序</div>';
					}
					_this.$sortPanel.html(html);
					
					
				}
			});
		},
		loadResList : function(id){
			$.ajax({
				type : "post",
				url : 'index/res/list',
				data : _this.data.searchData,
				beforeSend : function() {
					_this.$panel.html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
				},
				success : _this.initResPage
			});
		},
		initResPage : function(data) {
			if (!data.success) {
				util.dialog.infoDialog('查询出错');
				return;
			}
			data = data.data;
			var list = [];
			for ( var index in data.list) {
				var resource = data.list[index];
				if(!_this.topMap[resource.id]){
					list.push(resource);
				}
			}

			var totalPage = data.totalPage;
			var totalcount = data.totalCount;
			var html = _this.tpl.resListTpl.render({list : list});
			if(totalcount == 0){
				html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
			}
			_this.$panel.html(html);
			
			if (totalPage <= 1) {
				_this.$pagebar.html('');
			}
			if (totalPage >= 2) {
				$(function() {
					$.fn.jpagebar({
						renderTo : _this.$pagebar,
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
									_this.$panel.html('<div style="text-align:center;margin-top:20px;"><img src="img/loading.gif"><span style="color:#999999;display:inline-block;font-size:14px;margin-left:5px;vertical-align:bottom;">正在载入，请等待...</span></div>');
								},
								success : function(data){
									if (!data.success) {
										util.dialog.infoDialog('查询出错');
										return;
									}
									data = data.data;
									var list = [];
									for ( var index in data.list) {
										var resource = data.list[index];
										if(!_this.topMap[resource.id]){
											list.push(resource);
										}
									}

									var totalPage = data.totalPage;
									var totalcount = data.totalCount;
									var html = _this.tpl.resListTpl.render({list : list});
									if(totalcount == 0){
										html = '<div style="line-height:30px;background:#FFEBE5;padding-left:12px;">当前条件下搜索，获得约0条结果!</div>';
									}
									_this.$panel.html(html);
								}
							});
						}
					});
				});
			}
		}
	};
}(moka));