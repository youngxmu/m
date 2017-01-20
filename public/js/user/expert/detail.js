(function(P){
	var _this = null;
	_this = P.user.expert.detail = {
		searchUrl : 'expert/result',
		tpl : {
			resultListTpl : null
		},
		data : {
			expertMap : {}
		},
		queryXSData : {
			pageNo : 1,
			pageSize : 10
		},
		queryJXData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			// _this.tpl.resultListTpl = juicer($('#expert-det-tpl').html());
			_this.tpl.resultListTpl = juicer($('#result-list-tpl').html());
			_this.id = $('#expert_id').val();
			_this.initEvent();
			_this.loadxs();
			_this.loadjx();
		},
		initEvent : function(){
			$('.nav').on('click', 'li', function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				var targetId = $this.attr('target');
				var $target = $('#' + targetId);
				$target.show().siblings('div').hide();
			});
		},
		loadxs : function(){
			_this.queryXSData.id = _this.id;
			_this.queryXSData.type = 1;
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryXSData,
				beforeSend : function(){
					$('#xs_list').html(util.loadingPanel);
				},
				success : _this.initXSPage
			});
		},
		initXSPage : function(result) {
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#xs_list').html(_this.tpl.resultListTpl.render(data));
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#xs_list').html(P.building);
				return;
			}

		    if (totalPage <= 1) {
		        $("#xs_pagebar").html('');
		    }
		    if (totalPage >= 2) {
		        $(function() {
		            $.fn.jpagebar({
		                renderTo : $("#xs_pagebar"),
		                totalpage : totalPage,
		                totalcount : totalCount,
		                pagebarCssName : 'pagination2',
		                currentPage: parseInt(data.currentPage),
		                onClickPage : function(pageNo) {
		                    $.fn.setCurrentPage(this, pageNo);
		                    if (_this.instance_xs == null)
		                    	_this.instance_xs = this;
	
		                    _this.queryXSData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryXSData,
		                        beforeSend : function(){
									$('#xs_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#xs_list').html(_this.tpl.resultListTpl.render(data));
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
		},
		loadjx : function(){
			_this.queryJXData.id = _this.id;
			_this.queryJXData.type = 2;
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryJXData,
				beforeSend : function(){
					$('#jx_list').html(util.loadingPanel);
				},
				success : _this.initJXPage
			});
		},
		initJXPage : function(result) {
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#jx_list').html(_this.tpl.resultListTpl.render(data));
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#jx_list').html(P.building);
				return;
			}

		    if (totalPage <= 1) {
		        $("#jx_pagebar").html('');
		    }
		    if (totalPage >= 2) {
		        $(function() {
		            $.fn.jpagebar({
		                renderTo : $("#jx_pagebar"),
		                totalpage : totalPage,
		                totalcount : totalCount,
		                pagebarCssName : 'pagination2',
		                currentPage: parseInt(data.currentPage),
		                onClickPage : function(pageNo) {
		                    $.fn.setCurrentPage(this, pageNo);
		                    if (_this.instance_jx == null)
		                    	_this.instance_jx = this;
	
		                    _this.queryJXData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryJXData,
		                        beforeSend : function(){
									$('#jx_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#jx_list').html(_this.tpl.resultListTpl.render(data));
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