(function(P){
	var _this = null;
	_this = P.index = {
		data : {
			currUser : {
				openid : '',
				helpScore : 0
			}
		},
		init : function(){
			_this.initData();
			_this.questionListTpl = juicer($('#question-list-tpl').html());
			_this.initEvent();
			_this.initQuestions();
		},
		initData : function(){
			_this.data.currUser.openid = $('#openid').val();
			_this.data.currUser.nickname = $('#nickname').val();
			_this.data.currUser.subscribe = $('#subscribe').val();
			_this.complete = $('#complete').val();
		},
		initEvent : function(){
			$('body').on('touchstart', '.rule', function(){
				$('#rule_dlg').addClass('on').removeClass('off');
			});
			
			$('body').on('touchstart', '.qanswer-panel.m .qanswer', function(){
				var $this = $(this);
				if($this.hasClass('selected')){
					$this.removeClass('selected');
				}else{
					$this.addClass('selected');
				}
			});

			$('body').on('touchstart', '.qanswer-panel.s .qanswer', function(){
				var $this = $(this);
				if(!$this.hasClass('selected')){
					$this.addClass('selected').siblings('.qanswer').removeClass('selected');
				}else{
					$this.removeClass('selected');
				}
			});

			$('#wrapper').on('touchstart', '#btn_commit', _this.commit);

			
		},
		initQuestions : function(){
			$.ajax({
				url : 'paper/detail/1',
				type : 'post',
				success : function(data){
					if(data.success){
						$('#question_panel').html(_this.questionListTpl.render({list:data.paper.questions}));
					}else{
						alert(data.msg);
					}
				}
			});
		},
	    commit : function(){
	    	var answerArr = [];
	    	var $lis = $('#question_panel').find('li');
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
	    	
	    	$.ajax({
				url : 'paper/commit',
				type : 'post',
				data : {
					openid : _this.data.currUser.openid,
					answer : answerArr.join(',')
				},
				success : function(data){
					if(data.success){
						alert('答对了')
					}else{
						alert('打错了');
					}
				}
			});
	    },
		randomNum : function(min, max) {
			var Range = max - min;   
		    var Rand = Math.random();   
		    return(min + Math.round(Rand * Range));   
		},
		formatAnswer : function(answerStr){
			var answerArr = answerStr.split(',');
			var html = '';

			for(var i in answerArr){
				var index = parseInt(i) + 1;
				var word = util.getOption(index);
				console.log(word + ' ' +answerArr[i]);
				html += '<div class="qanswer" data-answer="'+ word +'"><em class="chk-box"></em><span class="qtext">' + word + '、' + answerArr[i] + '</span></div>';
			}
			return html;
		}
	};
}(game));
juicer.register('formatAnswer', game.index.formatAnswer );