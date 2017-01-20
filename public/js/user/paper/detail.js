(function(P){
	var _this = null;
	_this = P.user.paper.detail = {
		init : function(){
			// _this.questionUtils = question;
			_this.initData();
			_this.questionListTpl = juicer($('#question-list-tpl').html());
			_this.questionTpl = juicer($('#question-tpl').html());
			_this.selectionTpl = juicer($('#selection-tpl').html());
			_this.answerTpl = juicer($('#answer-tpl').html());
			_this.initEvent();
			_this.initQuestions();
			_this.initCounter();
		},
		initData : function(){
			_this.pid = $('#pid').val();
		},
		initEvent : function(){
			$('body').on('click', '.selection-panel span', function(){
				var type = _this.currQuestion.qtype;

				var $this = $(this);
				if(type == 3){//多选
					if($this.hasClass('selected')){
						$this.removeClass('selected');
					}else{
						$this.addClass('selected');
					}
				}else{
					$this.addClass('selected').siblings('span').removeClass('selected');
				}

				var $spans = $('.selection-panel').find('span.selected');
				var answer = '';
		    	$spans.each(function(){
		    		answer += $(this).attr('data-id');
		    	});
		    	_this.currQuestion.answer = answer;
		    	_this.questionsMap[_this.currQuestion.id] = _this.currQuestion;
				var index =  _this.currQuestion.index - 1;

				var $answerPanelIndex = $('#answer_panel').find('.answer-index-panel').eq(index);
				$answerPanelIndex.addClass('answered');
				$answerPanelIndex.find('.curr-answer').attr('data-answer', answer).text(answer);
				// console.log(_this.questionsMap[_this.currQuestion.id]);

				var $currQSpan = $('.answer-index-panel.selected');
				var $nextQSpan = $currQSpan.next('.answer-index-panel');
				if($nextQSpan.length > 0){
					$nextQSpan.addClass('selected').siblings('.answer-index-panel').removeClass('selected');
					var qid = $nextQSpan.attr('data-id');
					var question = _this.questionsMap[qid];
					_this.renderQuestion(question);
					var scoreVal = 2;
					if(question.type == 4){
						scoreVal = 1;
					}
					$('#content_title').text(question.index + '.' + _this.questionUtils.getQType(question.qtype) + '分值：' + scoreVal);
				}
			});

			$('body').on('click', '.answer-panel .answer-index-panel', function(){
				var type = _this.currQuestion.qtype;
				var $this = $(this);
				$this.addClass('selected').siblings('.answer-index-panel').removeClass('selected');
				var qid = $this.attr('data-id');
				var question = _this.questionsMap[qid];
				_this.renderQuestion(question);
			});
			
			$('body').on('click', '#btn_commit', _this.commit);
		},
		initQuestions : function(){
			$.ajax({
				url : 'paper/detail/' + _this.pid,
				type : 'post',
				success : function(data){
					if(data.success){
						_this.questions = data.paper.questions;
						_this.questionsMap = {};
						for(var index in _this.questions){
							var question = _this.questions[index];
							question.index = parseInt(index) + 1;
							_this.questionsMap[question.id] = question;
							if(index == 0){
								_this.renderQuestion(question);
							}
						}
						$('#answer_panel').html(_this.answerTpl.render({list:_this.questions}));
						$('#answer_panel').find('.answer-index-panel').first().addClass('selected');
					}else{
						alert(data.msg);
					}
				}
			});
		},
		renderQuestion : function(question){
			$('#question_panel').html(_this.questionTpl.render(question));
			$('#selection_panel').html(_this.selectionTpl.render(question));
			_this.currQuestion = question;
			var index = question.index - 1;
			// $('#answer_panel').find('span').eq(index).addClass('selected').siblings('span').removeClass('selected');
		},
	  
	  	commit : function(options){
	    	var $spans = $('#answer_panel').find('.answer-index-panel');
	    	var $answered = $('#answer_panel').find('.answered');
	    	console.log($spans.length +' ' + $answered.length);
	    	if($spans.length == $answered.length || (options && options.timeout)){
	    		_this.submit();
	    	}else{
	    		if(window.confirm('还有题目未答,确认提交')){
	    			_this.submit();
	    		}
	    	}
	    },
	    submit : function(){
	    	var answerArr = [];
	    	var $spans = $('#answer_panel').find('.answer-index-panel');
	    	var $answered = $('#answer_panel').find('.answered');

	    	$spans.each(function(){
	    		var qid = $(this).attr('data-id');
	    		var question = _this.questionsMap[qid];
	    		var uanswer = question.uanswer;
	    		
	    		if(!uanswer){
	    			uanswer = '未作答';
	    		}
	    		answerArr.push(uanswer);
	    	});
	    	$.ajax({
				url : 'paper/commit',
				type : 'post',
				data : {
					id : _this.pid,
					answer : answerArr.join(',')
				},
				success : function(data){
					if(data.success){
						var rtCount = 0;
						var wrCount = 0;
						for(var index in answerArr){
							if(answerArr[index] == _this.questions[index].rtanswer){
								rtCount++;
							}else{
								wrCount++;
							}
						}
						alert('答对' + rtCount +'道,答错' + wrCount + '道');
						setTimeout(function(){
							window.location.href = 'paper/history/detail/' + data.data.insertId;
						},1500);
					}else{
						alert(data.msg);
					}
				}
			});
	    },
		formatAnswer : function(answerStr){
			var answerArr = answerStr.split(',');
			var html = '';

			for(var i in answerArr){
				var index = parseInt(i) + 1;
				var word = util.getOption(index);
				html += '<div class="qanswer" data-answer="'+ word +'"><em class="chk-box"></em><span class="qtext">' + word + '、' + answerArr[i] + '</span></div>';
			}
			return html;
		},
		formatSelection : function(answerStr, answer){
			var answerArr = answerStr.split(',');
			var html = '';
			
			for(var i in answerArr){
				var index = parseInt(i) + 1;
				var word = util.getOption(index);
				if(answer && answer.indexOf(word) != -1){
					html += '<span data-id="' + word + '" class="selected">' + word + '</span>';
				}else{
					html += '<span data-id="' + word + '">' + word + '</span>';	
				}
				
			}
			return html;
		},
		initCounter : function(){
			var limit = $('#limit_time').val();
			var secs = Math.floor(limit / 1000);
			var counter = function(){
				if(secs <= 0){
					_this.commit({timeout: true});
					util.dialog.infoDialog('考试结束自动提交啦');
					clearInterval(timer);
					return;
				}
				var min = Math.floor(secs / 60);
				var sec = secs % 60;
				var str = min + ':' + sec;
				secs--;
				if(secs <= 0){
					str = '00:00';
				};
				$('#timer').text(str);
			};
			var timer = setInterval(counter, 1000);
			counter();
		}
	};
}(moka));
juicer.register('formatAnswer', moka.user.paper.detail.formatAnswer);
juicer.register('formatSelection', moka.user.paper.detail.formatSelection);