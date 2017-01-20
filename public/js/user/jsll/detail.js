(function(P){
	var _this = null;
	_this = P.user.resource.detail = {
		init : function(){
			_this.articleId = $('#article_id').val();;
			_this.initEvent();
		},
		initEvent : function(){
			$('#btn_edit').on('click', function(){
				window.location.href = 'article/edit?id=' + _this.articleId;
			});
		}
	};
})(moka);