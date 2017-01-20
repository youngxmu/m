(function(P){
	var _this = null;
	_this = P.user.expert.list = {
		searchUrl : 'expert/list',
		tpl : {
			expertListTpl : null
		},
		data : {
			expertMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			_this.type = $('#type').val();
			_this.tpl.expertListTpl = juicer($('#expert-list-tpl').html());
			_this.initEvent();

			var $this = $('.' + _this.type);
			$this.addClass('active').siblings().removeClass('active');
			var target = $this.attr('target');
			var $target = $('#' + target);
			$('#list_panel').hide();
			$('#type_panel').hide();
			$target.show();
			_this.queryData = {
				pageNo : 1,
				pageSize : 10
			};
			$('#expert_list').html('');
			$('#pagebar').html('');
			if(target == 'list_panel'){
				var key = $('#search_key').val();
				if(key && key!=''){
					_this.queryData.name = $('#search_key').val();
				}
				_this.searchUrl = 'expert/list';
				_this.search();
			}else{
				_this.searchUrl = 'expert/job';
			}
		},
		initEvent : function(){
			// $('#nav_tabs').on('click', 'li', function(){
			// 	var $this = $(this);
			// 	$this.addClass('active').siblings().removeClass('active');
			// 	var target = $this.attr('target');
			// 	var $target = $('#' + target);
			// 	$('#list_panel').hide();
			// 	$('#type_panel').hide();
			// 	$target.show();
			// 	_this.queryData = {
			// 		pageNo : 1,
			// 		pageSize : 10
			// 	};
			// 	$('#expert_list').html('');
			// 	$('#pagebar').html('');
			// 	if(target == 'list_panel'){
			// 		_this.searchUrl = 'expert/list';
			// 		_this.search();
			// 	}else{
			// 		_this.searchUrl = 'expert/job';
			// 	}
			// });
			$('#btn_search').on('click', function(){
				var $this = $(this);
				_this.queryData.name = $('#search_key').val();
				_this.search();
			});
			$('#type_panel').on('click', 'button', function(){
				var text = $(this).text();
				_this.queryData.job = text;
				_this.search();
			});

		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#expert_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#expert_list').html(_this.tpl.expertListTpl.render(data));

			var expertList = data.list;
			for(var index in expertList){
				var user = expertList[index];
				_this.data.expertMap[user.id] = user;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#expert_list').html(P.building);
				return;
			}

		    if (totalPage <= 1) {
		        $("#pagebar").html('');
		    }
		    if (totalPage >= 2) {
		        $(function() {
		            $.fn.jpagebar({
		                renderTo : $("#pagebar"),
		                totalpage : totalPage,
		                totalcount : totalCount,
		                pagebarCssName : 'pagination2',
		                currentPage: parseInt(data.currentPage),
		                onClickPage : function(pageNo) {
		                    $.fn.setCurrentPage(this, pageNo);
		                    if (_this.instance_experts == null)
		                    	_this.instance_experts = this;
	
		                    _this.queryData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#expert_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#expert_list').html(_this.tpl.expertListTpl.render(data));
										var expertList = data.list;
										for(var index in expertList){
											var user = expertList[index];
											_this.data.expertMap[user.id] = user;
										}
		                		    }
		                		    else {
		                		        util.dialog.infoDialog("查询信息失败，请重试。");
		                		    }
		                        }
		                    });
		                }
		            });
		        });
		    }
		}
	};
}(moka));