(function(P){
	var _this = null;
	_this = P.article.edit = {
		articleId : null,
		editor : null,
		tpl : {
			menuListTpl : null
		},
		data : {
			
		},
		init : function() {
			_this.tpl.menuListTpl = juicer($('#menu_list_tpl').html());
			var $span = $('.u-select-p').find('span');
			if($span.length == 0){
				_this.mid = 0;
				_this.initMenu();
			}else{
				_this.mid = $span.last().attr('data-id');
			}
			
			_this.initEvent();
			_this.initEditor();
		},
		initEvent : function(){
			$('#btn_commit').on('click', _this.commit);

			$('.u-select-p').on('change', '.menu-s', function(){
				_this.changeMenu($(this));
			});
		},
		initEditor : function(){
			_this.editor = new Simditor({
			  	textarea: $('#editor'),
			  	upload : {
			    	url: 'upload/img',
				    params: null,
				    fileKey: 'upload_file',
				    connectionCount: 3,
				    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			  	}
			});
		},
		initMenu : function(){
			$.ajax({
				type : 'get',
				url : 'menu/map',
				success : function(menuMap){
					_this.menuMap = menuMap;
					var menuList = [];
					for(var mid in menuMap){
				    	var menu = menuMap[mid];
				    	if(menu.mlevel == 1){
				    		if(menu.id == 11  ){//|| menu.id == 13 || menu.id == 14 || menu.id == 16
				    			menuList.push(menu);	
				    		}
				    	}
				    }
					var html = '<label>所属栏目：</label>';
					html += '<select id="ml_1_s" class="menu-s"></select>';
					html += '<select id="ml_2_s" class="menu-s"></select>';
					html += '<select id="ml_3_s" class="menu-s"></select>';
					$('.u-select-p').html(html);
					$('#ml_1_s').html(_this.tpl.menuListTpl.render({list: menuList}));
					_this.changeMenu($('#ml_1_s').find('option').first());
				}
			});
		},
		changeMenu : function($obj){
			var $this = $(this);
			if($obj.val()){
				$this = $obj;
			}
			var menu = _this.menuMap[$this.val()];
			var level = menu.mlevel;
			if(level >= 3){
				return;
			}
			level++;

			var $target = $('#ml_'+ level +'_s');
			var menuList = [];
			for(var index in menu.submenu){
		    	var smenu = _this.menuMap[menu.submenu[index]];
		    	menuList.push(smenu);
		    }
			$target.html(_this.tpl.menuListTpl.render({list: menuList}));

		},
		commit : function() {
			var $selects = $('.u-select-p').find('select');
			var mid = _this.mid;
			$selects.each(function(){
				if($(this).val()){
					mid = $(this).val();
				}
			});

			var content = _this.editor.getValue();
			var title = $('#title').val();
			var author = $('#author').val();
			var url = 'article/save';
			
			var postData = {
				title : title,
				author : author,
				content : content,
				mid : mid
			};

			if(_this.articleId != null){
				postData.id = _this.articleId;
			}

			$.ajax({
				url : url,
				type : 'post',
				data : postData,
				success : function(data){
					util.dialog.confirmDialog('继续提交',
						function(){

						},
						function(){
							window.location.href = 'article/detail/' + data.id;
						},
						'提交成功'
					);
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		}
	};
}(moka));