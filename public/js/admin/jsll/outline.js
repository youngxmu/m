(function(P){
	var _this = null;
	_this = P.admin.jsll.outline = {
		searchUrl : 'jsll/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		tpl : {},
		data : {
			searchData : {
				pageNo : 1,
				pageSize : 10000
			}
		},
		init : function() {
			_this.tpl.menuTpl = juicer($('#menu_tpl').html());
			_this.data.type = 1;
			_this.data.key = '政策';
			_this.editor = $('#content');
			_this.initEvent();
			_this.loadRule();
		},
		initEvent : function(){
			$('#menu_list').on('click', 'li', _this.onSel);
			$('body').on('click', '.add', _this.onAdd);
			$('body').on('click', '.del', _this.onDel);
			$('#btn_commit').on('click', _this.save);
		},
		loadRule : function(){
			$.ajax({
				url : 'jsll/list/' + _this.data.key,
				type : 'post',
				success : function(result){
					if(result.success){
						var html = _this.tpl.menuTpl.render(result.data);
						$('#menu_list').html(html);
						_this.listMap = {};
						for(var index in result.data.list){
							var item = result.data.list[index];
							_this.listMap[item.id] = item;
							if(index == 0){
								_this.id = item.id;
								$('#content_title').val(item.title);
								$('#content').val(item.content);
							}
						}
						$('#menu_list li .btn-info').first().addClass('active');
					}else{
						$('#menu_list').html('');
						$('#content_title').val('');
						$('#content').val('');			
					}
				}
			});
		},
		onSel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var item = _this.listMap[id];
			_this.currItem = item;
			_this.id = id;
			$('#content_title').val(item.title);
			$('#content').val(item.content);
		},
		onAdd : function(){
			_this.id = '';
			_this.type = '政策';
			_this.pid = -1;
			$('#content_title').val('');
			$('#content').val('');
		},
		onDel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			if(_this.data.type == 2){
				id = _this.id;
			}
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/jsll/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								$this.parent('div').parent('li').remove();
								$('#content_title').val('');
								$('#content').val('');
								util.dialog.toastDialog('删除成功');
							}else{
								alert(result.msg);
							}
						}
					});
				},
				function(){},
				'确认删除'
			);
		},
		save : function() {
			var postData = {};
			if(_this.data.type == 1){
				postData = {
					content : $('#content').val(),
					title : $('#content_title').val()
				};	
			}else{
				postData = {
					content : $('#txt_editor').val(),
					title : $('#tree_content_title').val()
				};	
			}
			
			if(_this.id){
				postData.id = _this.id;
			}else{
				postData.type = _this.type;
				postData.pid = _this.pid;
			}
			$.ajax({
				url : 'admin/jsll/save',
				type : 'post',
				data : postData,
				success : function(data){
					_this.loadRule();
					_this.initTopic();
					util.dialog.toastDialog('提交成功');
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		}
	};
}(moka));