(function(P){
	var _this = null;
	_this = P.user.paper = {
		init : function(){
			$('#nav_llks').addClass('aHover');
			_this.initEvent();
		},
		initEvent : function(){

		 	$('body').on('keydown','#ajax_login_form',function(e){
		        var event = window.event || e;
		        if(event.keyCode == 13){
		           $('#ajax_login_form').ajaxSubmit(function(data){
			      		// console.log(data);
			        	window.location.href=  'exam/list';
			      	});
		        }
		    });

			$('body').on('click', '#exam', function(){

				$.ajax({
					url : 'auth/user/islogin',
					type : 'post',
					success : function(result){
						if(result.success){
							window.location.href=  'exam/list';
						}else{
							showLogin();
						}
					}
				});
			});

			$('body').on('click', '#exam_manage', function(){
				$.ajax({
					url : 'auth/admin/islogin',
					type : 'post',
					success : function(result){
						if(result.success){
							window.location.href=  'admin/paper/list';
						}else{
							showAdminLogin();
						}
					}
				});
			});

			$('body').on('click', '#login_submit', function(){
		      	$('#ajax_login_form').ajaxSubmit(function(data){
		      		// console.log(data);
		        	window.location.href=  'exam/list';
		      	});
		    });

		    $('body').on('click', '#admin_login_submit', function(){
		      	$('#ajax_admin_form').ajaxSubmit(function(){
		        	window.location.href=  'admin/paper/list';
		      	});
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
		}
	};
	juicer.register('formatAnswer', _this.formatAnswer );
})(moka);

moka.user.paper.init();