(function(P){
	var _this = null;
	_this = P.user.vote.list = {
		empty : '<tr colspan="4"><td colspan="4" style="line-height:28px;padding:15px 0;text-align: center;">当前条件没有搜索到数据</td></tr>',
		loadingPanel : '<tr><td colspan="4" style="line-height:28px;padding:15px 0;text-align: center;"><span style="display:inline-block;font-size:15px;color:#999999;"><img src="img/loading.gif" style="float:left;margin-right:15px;">正在加载...</span></td></tr>',
		searchUrl : 'vote/list',
		tpl : {
			paperListTpl : null
		},
		data : {
			paperMap : {}
		},
		queryData : {
			name : '',
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			$('.h-search-bar').show();
			_this.tpl.paperListTpl = juicer($('#paper-list-tpl').html());
			_this.tpl.questionListTpl = juicer($('#question-list-tpl').html());
			_this.initEvent();
			_this.search();

			$('#h_btn_search').unbind('click');
			$('#h_btn_search').click(function(){
		      var name = $('#h_search_key').val();
		      _this.queryData.name = name;
		      _this.search();
		    });
		},
		initEvent : function(){
			$('.nav').on('click', 'span', function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				var mid = $this.attr('data-id');
				_this.initView(mid);
				// _this.queryData.mid = $this.attr('data-id');

				// _this.search();
			});
			$('body').on('click', '.oper .view', _this.onView);
		},
		onView : function(){
			var paperId = $(this).attr('data-id');
			var options = {
				paperId : paperId,
				chartId : 'canvas'
			}
			component.chart.show(options);
		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#paper_list').html(_this.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#paper_list').html(_this.tpl.paperListTpl.render(data));

			var paperList = data.list;
			for(var index in paperList){
				var user = paperList[index];
				_this.data.paperMap[user.id] = user;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#paper_list').html(_this.empty);
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
		                    if (_this.instance_papers == null)
		                    	_this.instance_papers = this;
	
		                    _this.queryData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#paper_list').html(_this.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#paper_list').html(_this.tpl.paperListTpl.render(data));
										var paperList = data.list;
										for(var index in paperList){
											var user = paperList[index];
											_this.data.paperMap[user.id] = user;
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
		},
		formatAnswer : function(answerStr){
			var answerArr = answerStr.split(',');
			var html = '';

			for(var i in answerArr){
				var index = parseInt(i) + 1;
				var word = util.getOption(index);
				console.log(word + ' ' +answerArr[i]);
				html += '<p>' + word + ':' + answerArr[i] + '</p>';
			}
			return html;
		}
	};
}(moka));

juicer.register('formatAnswer', moka.user.vote.list.formatAnswer );