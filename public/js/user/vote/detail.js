(function(P){
	var _this = null;
	_this = P.user.vote.detail = {
		init : function(){
			_this.initData();
			_this.questionListTpl = juicer($('#question-list-tpl').html());
			_this.initEvent();
			_this.initQuestions();
		},
		initData : function(){
			_this.pid = $('#pid').val();
			console.log(_this.pid);

		},
		initEvent : function(){
			$('body').on('click', '.qanswer-panel .qanswer', _this.commit);
		},
		initQuestions : function(){
			$.ajax({
				url : 'vote/detail/' + _this.pid,
				type : 'post',
				success : function(data){
					if(data.success){
						_this.questions = data.vote.questions;
						_this.questionsMap = {};
						for(var index in _this.questions){
							var question = _this.questions[index];
							_this.questionsMap[question.id] = question;
						}
						$('#question_panel').html(_this.questionListTpl.render({list:data.vote.questions}));
					}else{
						alert(data.msg);
					}
				}
			});
		},
		commit : function(){
			var $this = $(this);
			var $panel = $this.parent('.qanswer-panel');
			var $list = $this.parent('.qanswer-panel').parent('.question-list');
			var questionId = $panel.attr('data-id');
			var question = _this.questionsMap[questionId];
			var answer = $this.attr('data-answer');
			$.ajax({
				url : 'vote/commit',
				type : 'post',
				data : {
					pid : _this.pid,
					id : questionId,
					answer : answer,
					rtanswer: question.rtanswer
				},
				success : function(data){
					if(data.success){
						var $next = $list.next('.question-list');
						if($next.length == 0){
							_this.showChart();
						}else{
							$next.addClass('active').siblings().removeClass('active');	
						}
					}else{
						alert(data.msg);
					}
				}
			});
		},
	 	showChart : function(){
	 		var paperId = _this.pid;
			var options = {
				paperId : paperId,
				chartId : 'canvas'
			}
			component.chart.show(options);
	 	},
		formatAnswer : function(answerStr){
			var answerArr = answerStr.split(',');
			var html = '';

			for(var i in answerArr){
				var index = parseInt(i) + 1;
				var word = util.getOption(index);
				html += '<div class="qanswer " data-answer="'+ word +'"><span class="qtext btn btn-success">' + answerArr[i] + '</span></div>';
			}
			return html;
		}
	};
}(moka));
juicer.register('formatAnswer', moka.user.vote.detail.formatAnswer );