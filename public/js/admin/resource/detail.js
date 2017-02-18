(function(P){
	var _this = null;
	_this = P.article.detail = {
		dlg : {

		},
		init : function(){
			_this.articleId = $('#article_id').val();
			var $content = $('#article_content');
			$content.find('img').each(function(){
				var $img = $(this);
				$img.parent().css('text-align', 'center');
			});
			_this.initEvent();
		},
		initEvent : function(){
			$('#btn_edit').on('click', function(){
				window.location.href = 'admin/article/edit?id=' + _this.articleId;
			});

			$('#btn_check').on('click', _this.oncheck);
			
		},
		oncheck : function(){
			console.log(123);
			var content = '<div>';
			content += '<p>拒绝理由：</p><textarea id="check_reason" style="width:220px;padding: 10px;line-height:24px;"></textarea>';
			content += '</div>';
			_this.dlg.checkDlg =  dialog({
			    title: '审核',
			    content: content,
			    width : 240,
			    okValue : '通过',
     	        ok : _this.pass,
     	        cancelValue : '拒绝',
     	        cancel : _this.reject
			});
			_this.dlg.checkDlg.showModal();	
		},
		pass : function(){
			$.ajax({
				url : 'admin/check/article',
				type : 'post',
				data : {
					articleId : _this.articleId,
					status : 1
				},
				success : function (){
					_this.dlg.checkDlg.close();
				}
			});
		},
		reject : function(){
			var reason = $('#check_reason').val();
			console.log(reason);
			if(!reason || reason == ''){
				util.dialog.toastDialog('请输入拒绝理由', 1500);
				return false;
			}
			$.ajax({
				url : 'admin/check/article',
				type : 'post',
				data : {
					articleId : _this.articleId,
					description : reason,
					status : 2
				},
				success : function (){
					_this.dlg.checkDlg.close();
				}
			});
		}
	};
})(moka);