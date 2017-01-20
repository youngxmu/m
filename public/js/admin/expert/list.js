(function(P){
	var _this = null;
	_this = P.admin.expert.list = {
		searchUrl : 'admin/expert/list',
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
			_this.tpl.expertListTpl = juicer($('#expert-list-tpl').html());
			_this.tpl.dlgEditExpertTpl = juicer($('#dlg-edit-expert-tpl').html());
			_this.initEvent();
			_this.search();
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
			$('#s_q_type').on('change', function(){
				var $this = $(this);
				_this.queryData.qtype = $this.val();
				_this.search();
			});

			$('#btn_commit').on('click', _this.commit);
			$('#btn_add').on('click', _this.onAdd);


			$('body').on('click', '.oper .edit', _this.onEdit);
			
			$('body').on('click', '.oper .del', _this.onDel);

			$('body').on('click', '.expert-questions .btn-edit-questions', _this.onEditQuestions);
		},
		onAdd : function(){
			var d = dialog({
			    title: '增加',
			    content: _this.tpl.dlgEditExpertTpl.render(),
			    okValue : '确定',
			    onshow : function(){
			    	$('#datetimepicker').datetimepicker({
			    		minView : 'day'
			    	});
			    },
			    ok : function(){
					var expert = {};
					expert.name = $('#expert_name').val();
					expert.description = $('#expert_desc').val();
					var $questions = $('#expert_questions').find('.question-list');
					var qidArr = [];
					$questions.each(function(){
						qidArr.push($(this).attr('data-id'));
					});
					expert.qids = qidArr.join(',');
                    $.ajax({
						type : 'post',
						url : 'admin/expert/save',
						data : expert,
						success : function(result){
							_this.search();
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		onEdit : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var expert = _this.data.expertMap[id];
			if(!expert.questions){
			 	$.ajax({
					type : 'post',
					async : false,
					url : 'admin/expert/detail/' + id,
					success : function(result){
						if(!result.success){
							return false;
						}else{
							expert = result.expert;
							_this.data.expertMap[id] = expert;
						}
					}
				});
			}
			expert.questionListTpl = $('#question-list-tpl').html();
			expert.questionListData = {list: expert.questions};
			var d = dialog({
			    title: '编辑',
			    content: _this.tpl.dlgEditExpertTpl.render(expert),
		     	onshow : function(){
			    	$('#datetimepicker').datetimepicker();
			    },
			    okValue : '确定',
			    ok : function(){
			    	var expert = {};
			    	expert.id = id;
					expert.name = $('#expert_name').val();
					expert.description = $('#expert_desc').val();
					var $questions = $('#expert_questions').find('.question-list');
					var qidArr = [];
					$questions.each(function(){
						qidArr.push($(this).attr('data-id'));
					});
					expert.qids = qidArr.join(',');
                    $.ajax({
						type : 'post',
						url : 'admin/expert/save',
						data : expert,
						success : function(result){
							_this.search();
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		onDel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var d = dialog({
			    title: '删除',
			    content: '确认删除',
			    okValue : '确定',
			    ok : function(){
                    $.ajax({
						type : 'post',
						url : 'admin/expert/del',
						data : {id : id},
						success : function(result){
							_this.search();
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
		},
		onEditQuestions : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var expert = _this.data.expertMap[id];
			var options = {
				expert : expert,
				callback : function(qids, questions){
					var html = _this.tpl.questionListTpl.render({list: questions});
					$('#expert_questions').find('dd').html(html);
				}
			};
			P.admin.question.import.show(options);
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

juicer.register('formatAnswer', moka.admin.expert.list.formatAnswer );