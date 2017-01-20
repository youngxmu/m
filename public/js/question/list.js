(function(P){
	var _this = null;
	_this = P.admin.question.list = {
		searchUrl : 'admin/question/list',
		tpl : {
			questionListTpl : null
		},
		data : {
			questionMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			_this.tpl.questionListTpl = juicer($('#question-list-tpl').html());
			_this.tpl.dlgEditQuestionTpl = juicer($('#dlg-edit-question-tpl').html());
			_this.initEvent();
			_this.search();
		},
		initEvent : function(){
			$('#s_q_type').on('change', function(){
				var $this = $(this);
				_this.queryData.qtype = $this.val();
				_this.search();
			});

			$('#btn_commit').on('click', _this.commit);
			$('#btn_add').on('click', _this.onAdd);

			$('body').on('click', '.btn-op.add', function(){
				var $this = $(this);
				if($this.hasClass('disabled')){
					return;
				}
				var $dd = $(this).siblings('.option-panel');
				var length = $dd.find('p').length;
				var index = length + 1;
				var word = util.getOption(index);
				var html = '<p><em>' + word + '</em>:<input></p>';
				$dd.append(html);
				if(index > 2){
					$(this).siblings('.del').removeClass('disabled');
				}
				if(index > 9){
					$(this).addClass('disabled');
				}
			});
			
			$('body').on('click', '.btn-op.del', function(){
				var $this = $(this);
				if($this.hasClass('disabled')){
					return;
				}
				var $dd = $(this).siblings('.option-panel');
				var length = $dd.find('p').length;
				if(length > 2){
					$dd.find('p').last().remove();
				}

				if(length == 3){
					$(this).addClass('disabled');
				}
				if(length == 9){
					$(this).siblings('.add').removeClass('disabled');
				}
			});

			$('body').on('change', '#question_type', function(){
				var $this = $(this);
				if($this.val() != 1){
					$('.question-option').show();
				}else{
					$('.question-option').hide();
				}
			});

			$('body').on('click', '.question-oper .edit', _this.onEdit);
			
			$('body').on('click', '.question-oper .del', _this.onDel);
			
		},
		onAdd : function(){
			var d = dialog({
			    title: '新建题目',
			    content: _this.tpl.dlgEditQuestionTpl.render(),
			    okValue : '确定',
			    ok : function(){
					var user = {};
					var questionType = $('#question_type').val();
					var questionBody = $('#question_body').val();
					var questionRtanswer = $('#question_rtanswer').val();

					var answer = '';
					if(questionType != 1){
						var answerArr = [];
						var $inputs = $('.question-option').find('input');
						$inputs.each(function(){
							var $input = $(this);
							answerArr.push($input.val());
						});
						answer = answerArr.join(',');
					}
					

    				var question = {
    					qbody : questionBody,
    					qtype : questionType,
    					qanswer : answer,
    					rtanswer : questionRtanswer 
    				};

                    $.ajax({
						type : 'post',
						url : 'admin/question/save',
						data : question,
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
			var question = _this.data.questionMap[id];
			var d = dialog({
			    title: '编辑题目',
			    content: _this.tpl.dlgEditQuestionTpl.render(question),
		     	onshow: function(){
		     		$('#question_type').val(question.qtype);
		     		if(question.qtype != 1 ){
		     			var answerArr = question.qanswer.split(',');
						var html = '';

						for(var i in answerArr){
							var index = parseInt(i) + 1;
							var word = util.getOption(index);
							html += '<p><em>' + word + '</em>:<input value="' + answerArr[i] + '"></p>';
						}
						$('.option-panel').html(html);
		     			$('.question-option').show();
		     		}
		     		
			    },
			    okValue : '确定',
			    ok : function(){
					var questionType = $('#question_type').val();
					var questionBody = $('#question_body').val();
					var questionRtanswer = $('#question_rtanswer').val();

					var answer = '';
					if(questionType != 1){
						var answerArr = [];
						var $inputs = $('.question-option').find('input');
						$inputs.each(function(){
							var $input = $(this);
							answerArr.push($input.val());
						});
						answer = answerArr.join(',');
					}
					

					question.qbody = questionBody;
					question.qtype = questionType;
					question.qanswer = answer;
					question.rtanswer = questionRtanswer;

                    $.ajax({
						type : 'post',
						url : 'admin/question/save',
						data : question,
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
			    title: '删除题目',
			    content: '确认删除',
			    okValue : '确定',
			    ok : function(){
                    $.ajax({
						type : 'post',
						url : 'admin/question/del',
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
		search : function(){
			if(!_this.queryData.qtype || _this.queryData.qtype == 0){
				console.log(123);
				delete _this.queryData.qtype;
				
			}
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#question_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#question_list').html(_this.tpl.questionListTpl.render(data));

			var questionList = data.list;
			for(var index in questionList){
				var user = questionList[index];
				_this.data.questionMap[user.id] = user;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if (totalPage <= 1) {
		        $("#pagebar").html('');
		    }
			if(totalCount == 0){
				$('#question_list').html(P.building);
				return;
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
									$('#question_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#question_list').html(_this.tpl.questionListTpl.render(data));
										var questionList = data.list;
										for(var index in questionList){
											var user = questionList[index];
											_this.data.questionMap[user.id] = user;
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
				html += '<p>' + word + ':' + answerArr[i] + '</p>';
			}
			return html;
		}
	};
}(moka));

juicer.register('formatAnswer', moka.admin.question.list.formatAnswer );