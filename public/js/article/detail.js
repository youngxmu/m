(function(P){
	var _this = null;
	_this = P.article.detail = {
		init : function(){
			_this.articleId = $('#article_id').val();;
			var $content = $('#article_content');
			$content.find('img').each(function(){
				var $img = $(this);
				$img.parent().css('text-align', 'center');
			});
			_this.initEvent();
		},
		initEvent : function(){
			$('#btn_edit').on('click', function(){
				window.location.href = 'article/edit?id=' + _this.articleId;
			});
		}
	};
})(moka);