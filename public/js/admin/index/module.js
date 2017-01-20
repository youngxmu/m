(function(P){
	var _this = null;
	_this = P.admin.indexm = {
		searchUrl : 'index/list/res',
		tpl : {
			moduleTpl : null
		},
		data : {
			moduleMap : {}
		},
		init : function() {
			_this.tpl.moduleTpl = juicer($('#module-tpl').html());
			_this.initEvent();
			_this.loadModules();
		},
		initEvent : function(){
			$('body').on('click', '.add-key', _this.add);
			$('body').on('click', '.del-key', _this.del);
		},
		loadModules : function(){
			var $panel = $('.module-container');
			$.ajax({
				type : 'post',
				url : 'admin/index/modules',
				beforeSend : function(){
					$panel.html(util.loadingPanel);
				},
				success : function(data){
					if(data.success){
						_this.data.moduleMap = {};
						var list = data.list;
						for(var index in list){
							var module = list[index];

							if(!module.keywords || $.trim(module.keywords) == ''){
								module.upkeywords = '';
								module.keys = [];
							}else{
								module.keys = module.keywords.split(',');
							}

							if(!module.upkeywords || $.trim(module.upkeywords) == ''){
								module.upkeywords = '';
								module.upkeys = [];
							}else{
								module.upkeys = module.upkeywords.split(',');
							}
							console.log(module.upkeys);
							_this.data.moduleMap[module.id] = module;
						}
						$panel.html(_this.tpl.moduleTpl.render({list:list}));	
					}
				}
			});
		},
		getKeywords : function(mid, type){
			var $spans = $('#key_panel_' + mid).find('.del-key');
			if(type == 1){
				$spans = $('#upkey_panel_' + mid).find('.del-key');
			}
			var keywords = [];
			$spans.each(function(){
				keywords.push($(this).attr('data-key'));
			});
			return keywords.join(',');
		},
		add : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var type = $this.attr('data-t');
			var $panel = $('#key_panel_' + id);
			
			if(type == 1){
				$panel = $('#upkey_panel_' + id);
			}
			util.dialog.defaultDialog(
				'<input id="key_name">',
				function(){
					var keyName = $('#key_name').val();
					if(!keyName){
						return false;
					}

					var keyHtml = '<div>' + keyName + '<span data-id="' + id + '" data-t="'+ type +'" data-key="' + keyName + '" class="del-key">×</span></div>'
					$panel.append(keyHtml);
					var keywords = _this.getKeywords(id,type);
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/index/updateModule',
						data : {
							id:id,
							keywords : keywords,
							type : type
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
			var type = $this.attr('data-t');
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$this.parent('div').remove();
					var keywords = _this.getKeywords(id, type);
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/index/updateModule',
						data : {
							id:id,
							keywords : keywords,
							type : type
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
		},
		saveMsg : function(){
			var data = {
				title : $('#msg_title').val(),
				content : _this.msgEditor.getValue()
			};
			if(_this.data.msgId){
				data.id = _this.data.msgId;
			}
			$.ajax({
				type : "post",
				url : 'admin/message/save',
				data : data,
				success : function(result){
					if(!result.success){
						return util.dialog.infoDialog(result.msg);
					}else{
						_this.loadMsg();
						util.dialog.toastDialog('保存成功');
					}
				}
			});
		}
	};
}(moka));
