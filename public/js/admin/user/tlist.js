(function(P){
	var _this = null;
	_this = P.admin.teacher.list = {
		searchUrl : 'admin/teacher/list',
		tpl : {
			userListTpl : null//模特列表模板
		},
		data : {
			editUserId : null,
			userMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 15
		},
		init : function(){
			_this.tpl.userListTpl = juicer($('#user_list_tpl').html());
			_this.tpl.dlgUserEditTpl = juicer($('#dlg_user_edit_tpl').html());
			_this.initEvent();
			_this.search();
		},
		initEvent : function(){
			$('#btn_search').click(_this.search);
			$('body').on('click', '#btn_add_user',_this.onEdit);
			$('#user_list').on('click', '.edit', _this.onEdit);
			$('#user_list').on('click', '.del', _this.onDel);
		},
		search : function(){
			var username = $('#user_name').val();
			var tel = $('#user_tel').val();

			_this.queryData.pageNo = 1;
			_this.queryData.username = username;
			_this.queryData.tel = tel;
			console.log(_this.queryData);
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#user_list').html('<tr><td colspan=7>' + util.loadingPanel + '</td></tr>');
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			if(!result.success){
				return alert('查询出错');
			}
			var data = result.data;
		    $('#user_list').html(_this.tpl.userListTpl.render(data));

			var userList = data.list;
			for(var index in userList){
				var user = userList[index];
				_this.data.userMap[user.id] = user;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;
		    if (totalPage <= 1) {
		        $("#pagebar").html('');
		    }
		    if (totalPage >= 2) {
		        $(function() {
		            $.fn.jpagebar({
		                renderTo : $("#pagebar"),
		                totalpage : totalPage,
		                totalcount : totalCount,
		                pagebarCssName : 'pagination2',
		                currentPage: parseInt(data.currentPage),
		                onClickPage : function(pageNo) {
		                    $.fn.setCurrentPage(this, pageNo);
		                    if (_this.instance_papers == null)
		                    	_this.instance_papers = this;
	
		                    _this.queryData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#user_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#user_list').html(_this.tpl.userListTpl.render(data));
										var userList = data.list;
										for(var index in userList){
											var user = userList[index];
											_this.data.userMap[user.id] = user;
										}
		                		    }
		                		    else {
		                		        util.dialog.infoDialog("查询试卷信息失败，请重试。");
		                		    }
		                        }
		                    });
		                }
		            });
		        });
		    }
		},
		onEdit : function(){

			var id = $(this).attr('data-id');
			console.log(id);
			var user = {};
			var title = '新增';
			var data = {};
			if(id){
				user = _this.data.userMap[id];
				title = '编辑';
				data.id = id;
			}
			var content = _this.tpl.dlgUserEditTpl.render(user);
			util.dialog.defaultDialog(content,
				function(){
					var $panel = $('#user_edit_panel');
					
					$panel.find('input').each(function(){
						var $this = $(this);
						var name = $this.attr('name');
						var val = $this.val();
						data[name] = val;
					});
					for(var key in data){
						if(key == 'name' && data[key] == ''){
							alert('用户名和密码必须填写');
							return false;
						}

						if(!id && key == 'password' &&  data[key] == ''){
							alert('用户名和密码必须填写');
							return false;
						}
					}

					$.ajax({
						url : 'admin/teacher/save',
						type : 'post',
						data : data,
						success : function(result){
							if(!result.success){
								alert(result.msg);
								return false;
							}
							_this.search();
						},
						error : function(){
							alert('添加失败，请检查网络连接');
						}
					});
				},
				function(){
				},
				title);
		},
		onDel : function(){
			var id = $(this).attr('data-id');
			util.dialog.infoDialog('确认删除', function(){
				$.ajax({
					url : 'admin/teacher/del',
					type : 'post',
					success : function(result){
						if(result.success){
							util.dialog.infoDialog('删除成功');
							_this.search();
						}else{
							util.dialog.infoDialog('删除失败');
						}
					}
				});
			});
		}
	};
}(moka));