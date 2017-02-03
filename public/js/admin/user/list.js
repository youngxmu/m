(function(P){
	var _this = null;
	_this = P.admin.user.list = {
		searchUrl : 'admin/user/queryList',
		tpl : {
			userListTpl : null//模特列表模板
		},
		data : {
			editUserId : null,
			userMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function(){
			_this.tpl.userListTpl = juicer($('#user_list_tpl').html());
			_this.tpl.dlgUserEditTpl = juicer($('#dlg_user_edit_tpl').html());
			_this.initEvent();
			_this.search();
			_this.initUploader();
		},
		initEvent : function(){
			$('#btn_search').click(function(){
				_this.queryData = {
					pageNo : 1,
					pageSize : 10
				};

				if($('#user_id').val()){
					_this.queryData.userId = $('#user_id').val();
					_this.searchUrl = 'admin/user/queryUserById';
				}else if($('#user_name').val()){
					_this.queryData.name = $('#user_name').val();
					_this.searchUrl = 'admin/user/queryUserByName';
				}else if($('#user_tel').val()){
					_this.queryData.tel = $('#user_tel').val();
					_this.searchUrl = 'admin/user/queryUserByTel';
				}else if($('#user_email').val()){
					_this.queryData.email = $('#user_email').val();
					_this.searchUrl = 'admin/user/queryUserByEmail';
				}else{
					_this.searchUrl = 'admin/user/queryList';
				}
				_this.search();
			});
			$('#user_list').on('click', '.del', _this.onDel);
			$('#user_list').on('click', 'tr', _this.onSel);
			$('#btn_dels').on('click', _this.onDels);
			$('body').on('click', '#btn_add',_this.onEdit);
			$('#user_list').on('click', '.edit', _this.onEdit);
		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#user_list').html('<tr><td colspan=8>' + util.loadingPanel + '</td></tr>');
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
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
		onSel : function(){
			var $this = $(this);
			if($this.hasClass('active')){
				$this.removeClass('active');
			}else{
				$this.addClass('active');
			}
		},
		onEdit : function(){
			var id = $(this).attr('data-id');
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
							util.dialog.infoDialog('用户名和密码必须填写');
							return false;
						}

						if(!id && key == 'password' &&  data[key] == ''){
							util.dialog.infoDialog('用户名和密码必须填写');
							return false;
						}
					}

					$.ajax({
						url : 'admin/user/save',
						type : 'post',
						data : data,
						success : function(result){
							if(!result.success){
								util.dialog.infoDialog(result.msg);
								return false;
							}
							_this.search();
						},
						error : function(){
							util.dialog.infoDialog('添加失败，请检查网络连接');
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
					url : 'admin/user/del',
					type : 'post',
					data : {id:id},
					success : function(result){
						if(result.success){
							util.dialog.toastDialog('删除成功');
							_this.search();
						}else{
							util.dialog.infoDialog('删除失败');
						}
					}
				});
			});
		},
		onDels : function(){
			var idArr = [];
			$('#user_list .active').each(function(){
				var id = $(this).attr('data-id');	
				idArr.push(id);
			});
			if(idArr.length == 0){
				return util.dialog.infoDialog('请选择至少1位用户');
			}
			
			util.dialog.infoDialog('确认删除', function(){
				$.ajax({
					url : 'admin/user/dels',
					type : 'post',
					data : {ids:idArr.join(',')},
					success : function(result){
						if(result.success){
							util.dialog.toastDialog('删除成功');
							_this.search();
						}else{
							util.dialog.infoDialog('删除失败');
						}
					}
				});
			});
		},

		initUploader : function(uploadSrc, extensions) {// 初始化文件上传控件
			plupload.addI18n({
		        'File extension error.' : '文件类型错误',
		        'File size error.' : '文件大小超出限制'
		    });
			_this.fileUploader = new plupload.Uploader({
				runtimes : 'html5,flash',
				browse_button : 'btn_import', // 选择文件按钮ID
				max_file_size : '100mb', // 文件上传最大值
				chunks : false,// 不分块上传
				unique_names : true, // 上传的文件名是否唯一,只有在未进行分块上传时文件名唯一才有效
				url : '/upload/file',
				flash_swf_url : 'js/lib/plupload/plupload.flash.swf',// plupload.flash.swf文件所在路径
				multi_selection : false,
				filters: [
				     {title: "允许文件类型", extensions: 'xls,xlsx'}
		        ],
				init : {
					FileUploaded : function(up, file, info) {
						$('#btn_commit').css('disabled', '');// 启用保存按钮
						_this.fileUploader.disableBrowse(false);
						var data = eval('(' + info.response + ')');
						var fileName = data.fileName;
						if (data.success == false) {
							util.dialog.infoDialog(data.msg);
							return;
						} else {
							util.dialog.loadingDialog('上传成功正在处理', function(d){
								$.ajax({
									url : 'admin/user/import',
									type : 'post',
									data : {fileName:fileName},
									success : function(result){
										if(result.success){
											util.dialog.toastDialog('导入成功');
											_this.search();
										}else{
											util.dialog.infoDialog('导入失败');
										}
									},
									complete : function(){
										d.close();
									}
								});
							});
							
						}
					},
					FilesAdded : function(up, file) {
						$.each(up.files, function (i, file) {
							if (up.files.length <= 1) {
					            return;
					        }
					        up.removeFile(file);
						});
						var orgName = file[0].name.substring(0,file[0].name.lastIndexOf('.')).replace(/[ ]/g,' ');
						$('#filename').text(orgName).show();
						_this.fileUploader.start();
					},
					BeforeUpload : function(up, file) {
						_this.fileUploader.disableBrowse(true);
						$('#btn_commit').css('disabled', 'disabled');// 禁用保存按钮
					},
					UploadProgress : function(up, file) {
						$('#process_bar').show();
						$('#process_rate').css('width', file.percent + '%');
						$('#process_rate').text(file.percent + '%');
					},
					Error : function(up, err) {
						$('#loading').hide();
						_this.fileUploader.disableBrowse(false);
						up.refresh(); // Reposition Flash/Silverlight
						// util.checkStatus(err);
					} 
				}
			});
			_this.fileUploader.init();
		}
	};
}(moka));