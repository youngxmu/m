(function(P){
	var _this = null;
	_this = P.admin.indexm = {
		searchUrl : 'admin/index/news/list',
		tpl : {
			newspl : null
		},
		data : {
			newsMap : {}
		},
		queryDate : {
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			_this.tpl.newspl = juicer($('#news-tpl').html());
			_this.initEvent();
			_this.loadNews();
		},
		initEvent : function(){
			$('body').on('click', '.add-key', _this.add);
			$('body').on('click', '.edit-key', _this.edit);
			$('body').on('click', '.del-key', _this.del);
		},
		loadNews : function(){
			var $panel = $('#news_list');
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				beforeSend : function(){
					$panel.html(util.loadingPanel);
				},
				success : function(data){
					if(data.success){
						_this.data.newsMap = {};
						var list = data.list;
						for(var index in list){
							var module = list[index];
							_this.data.newsMap[module.id] = module;
						}
						$panel.html(_this.tpl.newspl.render({list:list}));	
					}
				}
			});
		},
		add : function(){
			var id = $(this).attr('data-id');
			var $panel = $('#key_panel_' + id);
			util.dialog.defaultDialog(
				'<input id="key_name">',
				function(){
					var keyName = $('#key_name').val();
					if(!keyName){
						return false;
					}

					var keyHtml = '<div>' + keyName + '<span data-id="' + id + '" data-key="' + keyName + '" class="del-key">×</span></div>'
					$panel.append(keyHtml);
					var keywords = _this.getKeywords(id);
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/index/updateModule',
						data : {
							id:id,
							keywords : keywords
						},
						success : function(result){
							if(result.success){
								util.dialog.toastDialog('添加成功');
							}else{
								util.dialog.infoDialog(result.msg);
							}
						}
					});
				},
				function(){},
				'增加标签'
			);
		},
		del : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$this.parent('div').remove();
					var keywords = _this.getKeywords(id);
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/index/updateModule',
						data : {
							id:id,
							keywords : keywords
						},
						success : function(result){
							if(result.success){
								util.dialog.toastDialog('删除成功');
							}else{
								util.dialog.infoDialog(result.msg);
							}
						}
					});
				},
				function(){},
				'确认删除'
			);
		}
	};
}(moka));
