(function(P){
	var _this = null;
	_this = P.admin.jsjn.list = {
		searchUrl : 'jsjn/list',
		topicTree : null,
		topicNodes : null,
		topicData : [],
		currNode : null,
		data : {
			image : 'jpg,png,gif,jpeg,bmp',
			initData : null,
			initCallback : null,
			searchData : {
				pageNo : 1,
				pageSize : 10
			}
		},
		init : function() {
			$('#hd_menu_resource').addClass('current');
			_this.data.submenuTpl = juicer($('#submenu-tpl').html());
			_this.data.editMenuDlgTpl = juicer($('#edit_menu_dlg').html());
			_this.type = 1;
			_this.initEvent();
			_this.initEditor();
			_this.changeType({init: true});

			$(".res-menu").dragsort({ 
				dragSelector: "li", 
				dragBetween: true, 
				dragEnd: _this.saveOrder, 
				placeHolderTemplate: '<li><div class="btn-group"></div></li>'
			});
		},
		initEvent : function(){
			$('body').on('click', '.res-menu button', _this.showEditor);
			$('body').on('click', '.add', _this.onAdd);
			$('body').on('click', '.del', _this.onDel);
			$('body').on('click', '#btn_modify', _this.commitInfo);
			$('body').on('click', '.nav-tabs li', _this.changeType);
		},
		changeType : function(options){
			var $this = $(this);
			if(options && options.init){
				$this = $('.nav-tabs li').first();
			}
			$this.addClass('active').siblings('li').removeClass('active');
			var type = $this.attr('data-type');
			var mid = $this.attr('data-mid');
			_this.data.searchData.mid = mid;
			$.ajax({
				type : "post",
				url : 'menu/submenu/' + mid,
				success : function(data){
					if(data.success){
						$('.res-menu').html(_this.data.submenuTpl.render(data.data));
						_this.mid = $('.res-menu li').first().attr('data-id');
						_this.showEditor({mid : _this.mid});
					}else{
						alert(data.msg);
					}
				}
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
		showEditor : function(options){
			var $menu = $(this);
			var mid = $(this).attr('data-id');
			if(options && options.mid){
				mid = options.mid;
				$menu = $('.res-menu li .btn-info').first();
			}

			$('.res-menu li .btn-info').removeClass('active');
			$menu.addClass('active');
			_this.mid = mid;
			$.ajax({
				type : "post",
				url : 'admin/index/info/view/' + mid,
				success : function(data){
					if(data.success){
						_this.editor.setValue(data.data.content);
					}else{
						alert(data.msg);
					}
				}
			});
		},
		commitInfo : function() {
			var postData = {
				content : _this.editor.getValue(),
				mid : _this.mid
			};
			$.ajax({
				url : 'admin/index/info/save',
				type : 'post',
				data : postData,
				success : function(data){
					util.dialog.infoDialog('提交成功');
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		},
		onAdd : function(){
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/article/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								$this.parent('div').parent('li').remove();
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
		onDel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			util.dialog.confirmDialog(
				'确认删除',
				function(){
					$.ajax({
						type : "post",
						cache : false,
						url : 'admin/article/del',
						data : {id:id},
						success : function(result){
							if(result.success){
								$this.parent('div').parent('li').remove();
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
		saveOrder : function(){
			var $menus = $('.res-menu li');
			var menus = [];
			$menus.each(function(index){
				var id = $(this).attr('data-id');
				menus.push({
					id : id,
					index : index
				});
			});
			$.ajax({
				type : "post",
				cache : false,
				url : 'menu/update/indexNo',
				data : {menus : JSON.stringify(menus)},
				success : function(result){
					if(!result.success){
						util.dialog.toastDialog(result.msg);
					}
				}
			});
		}
	};
}(moka));