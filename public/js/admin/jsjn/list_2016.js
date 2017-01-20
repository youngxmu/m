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
			_this.data.resourceTpl = juicer($('#resource-tpl').html());
			_this.data.picTpl = juicer($('#pic_tpl').html());
			_this.data.videoTpl = juicer($('#video_tpl').html());
			_this.data.pptTpl = juicer($('#ppt_tpl').html());
			_this.data.editMenuDlgTpl = juicer($('#edit_menu_dlg').html());
			_this.type = 1;
			_this.initEvent();
			_this.initEditor();
			_this.showEditor('130101');
			_this.changeType({init: true});
		},
		initEvent : function(){
			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
			});
			
			$('.resource-opr').on('click', '.add',function(){
				var zTree = _this.getCurrTree();
				_this.showAddArticle();
			});

			$('body').on('keydown','#keyword',function(e){
		        var event = window.event || e;
		        if(event.keyCode == 13){
		          	_this.data.searchData.keyword = $('#keyword').val();
					_this.searchResource();
		        }
		    });

			$('#btn_search').click(function(){
				_this.data.searchData.keyword = $('#keyword').val();
				_this.searchResource();
			});
			$('body').on('click', '.oper .del', _this.showDelArticle);

			$('body').on('click', '.res-menu button', function(){
				var mid = $(this).attr('data-id');
				_this.showEditor(mid);
			});

			$('body').on('click', '#btn_modify', _this.commitInfo);

			$('body').on('click', '.nav-tabs li', _this.changeType);

			$('.type-panel').on('click', 'li',function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				_this.type = $this.attr('data-type');
				_this.initTopic();
			});
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
			$('#menu_panel').hide();
			$('#tree_panel').hide();
			if(type == 1 || type == 2){
				$('#menu_panel').show();
				$.ajax({
					type : "post",
					url : 'menu/submenu/' + mid,
					success : function(data){
						if(data.success){
							$('.res-menu').html(_this.data.submenuTpl.render(data.data));
						}else{
							alert(data.msg);
						}
					}
				});
				// _this.showEditor(mid);
			}

			if(type == 3){
				// _this.searchResource();
				$('#tree_panel').show();	
			}
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
			_this.txt_editor = $('#txt_editor');
			// new Simditor({
			//   	textarea: $('#txt_editor'),
			//   	upload : {
			//     	url: 'upload/img',
			// 	    params: null,
			// 	    fileKey: 'upload_file',
			// 	    connectionCount: 3,
			// 	    leaveConfirm: 'Uploading is in progress, are you sure to leave this page?'
			//   	}
			// });
		},
		showEditor : function(mid){
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
			var mid = _this.mid;
			var content = _this.editor.getValue();
			
			var postData = {
				content : content,
				mid : mid
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
		getMenuPath : function(node){
			var menuArr = [_this.pid];
			var level = 0;
			if(node == null){
				return '';
			}else{
				level = node.level;
			}
			for(var i=0;i<=level;i++){
				menuArr.push(node.id);
				node = node.getParentNode();
			}
			return menuArr.join(',');
		},
		showAddArticle : function(){
			var menuPath = _this.getMenuPath(_this.currNode);
			window.open('admin/article/upload?menuPath=' + menuPath);
		},
		showDelArticle : function(){
			var id = $(this).attr('data-id');
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
								_this.searchResource();
							}else{
								alert(result.msg);
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