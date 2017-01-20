(function(P){
	var _this = null;
	_this = P.user.paperhistory.detail = {
		init : function(){
			_this.initData();
			_this.questionListTpl = juicer($('#question-list-tpl').html());
			_this.initEvent();
			_this.initQuestions();
		},
		initData : function(){
			_this.pid = $('#pid').val();
		},
		initEvent : function(){
			$('body').on('click', '.qanswer-panel.m .qanswer', function(){
				var $this = $(this);
				if($this.hasClass('selected')){
					$this.removeClass('selected');
				}else{
					$this.addClass('selected');
				}
			});

			$('body').on('click', '.qanswer-panel.s .qanswer', function(){
				var $this = $(this);
				if(!$this.hasClass('selected')){
					$this.addClass('selected').siblings('.qanswer').removeClass('selected');
				}else{
					$this.removeClass('selected');
				}
			});

			$('body').on('click', '#btn_commit', _this.commit);
		},
		initQuestions : function(){
			$.ajax({
				url : 'paper/history/detail/' + _this.pid,
				type : 'post',
				success : function(data){
					if(data.success){
						_this.questions = data.paper.questions;
						$('#question_panel').html(_this.questionListTpl.render({list:data.paper.questions}));
					}else{
						alert(data.msg);
					}
				}
			});
		},
	    commit : function(){
	    	var answerArr = [];
	    	var $lis = $('#question_panel').find('.question-list');
	    	$lis.each(function(){
	    		var answer = '';
	    		var answers = $(this).find('.qanswer.selected');
	    		answers.each(function(){
	    			answer += $(this).attr('data-answer');
	    		});
	    		if(answer != ''){
	    			answerArr.push(answer);		
	    		}
	    	});

	    	if(answerArr.length < $lis.length){
    			alert('还有题目未答');
    			return;
    		}
	    	console.log(answerArr);
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
							if(answer[index] == _this.questions[index].rtanswer){
								rtCount++;
							}else{
								wrCount++;
							}
						}
						alert('答对' + rtCount +'道,答错' + wrCount + '道');
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
			console.log(answerStr);
			return html;
		}
	};
}(moka));
juicer.register('formatAnswer', moka.user.paperhistory.detail.formatAnswer );