(function(P){
	var _this = null;
	_this = P.admin.editor = {
		tpl : {

		},
		init : function(options){
			_this.tpl.dlgEditTpl = juicer($('#dlg-edit-tpl').html());
			_this.tpl.dlgEditresTpl = juicer($('#dlg-editres-tpl').html());
			_this.initEvent();
			_this.getData();
		},
		initEvent : function(){
			$('#btn_edit').on('click', function(){
				window.location.href = 'admin/article/edit?id=' + _this.articleId;
			});

			$('#btn_check').on('click', _this.oncheck);
			
		},
		onEdit : function(articleId){
			_this.articleId = articleId;
			_this.getData();
			_this.article = options.article;
		},
		getData : function(){
			$.ajax({
				url : 'admin/check/article',
				type : 'post',
				async : false,
				data : {
					articleId : _this.articleId,
					status : 1
				},
				success : function (data){
					if(data.success){
						_this.article = data.data;
					}
				}
			});
		}
	};
})(moka);