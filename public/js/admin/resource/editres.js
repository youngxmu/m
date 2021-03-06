(function(P){
	var _this = null;
	_this = P.admin.resource.editres = {
		url : 'admin/resource/save',
		articleId : null,
		editor : null,
		tpl : {
			menuListTpl : null
		},
		data : {},
		init : function() {
			_this.articleId = $('#article_id').val();
			_this.fileName = $('#file_name').val();
			_this.initEvent();

			var fileType = $('#type').val();
			var fileTypeFilters = [];
			for(var type in P.fileType){
				fileTypeFilters.push(type);
			}
			_this.initUploader('/upload/file', fileTypeFilters.join(','));
			
		},
		initEvent : function(){
			$('#btn_commit').on('click', _this.commit);
		},
		initUploader : function(uploadSrc, extensions) {// 初始化文件上传控件
			plupload.addI18n({
		        'File extension error.' : '文件类型错误',
		        'File size error.' : '文件大小超出限制'
		    });
			_this.fileUploader = new plupload.Uploader({
				runtimes : 'html5,flash',
				browse_button : 'btn_upload', // 选择文件按钮ID
				max_file_size : '100mb', // 文件上传最大值
				chunks : false,// 不分块上传
				unique_names : true, // 上传的文件名是否唯一,只有在未进行分块上传时文件名唯一才有效
				url : uploadSrc,
				flash_swf_url : 'js/lib/plupload/plupload.flash.swf',// plupload.flash.swf文件所在路径
				multi_selection : false,
				filters: [
				     {title: "允许文件类型", extensions: extensions}
		        ],
				init : {
					FileUploaded : function(up, file, info) {
						$('#btn_commit').css('disabled', '');// 启用保存按钮
						$('#btn_upload').text('修改文件');
						_this.fileUploader.disableBrowse(false);
						var data = eval('(' + info.response + ')');
						_this.fileName = data.fileName;
						if (data.success == false) {
							util.dialog.infoDialog(data.msg);
							return;
						} else {
							util.dialog.toastDialog('上传成功', 2000, function(){
								$('#process_bar').hide();
								$('#process_rate').css('width', '0');
								$('#process_rate').text('0%');
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
		},
		commit : function() {
			var $selects = $('.u-select-p').find('select');
			var mid = _this.mid;
			$selects.each(function(){
				if($(this).val()){
					mid = $(this).val();
				}
			});

			var title = $('#title').val();
			var author = $('#author').val();
			var description = $('#description').val();
			
			
			var fileName = _this.fileName;
			if(fileName.indexOf('/uploads/') != -1){
				fileName = fileName.split('/uploads/')[1];
			}
			var postData = {
				title : title,
				author : author,
				description : description,
				fileName : _this.fileName,
				mid : mid
			};

			if(_this.articleId != null){
				postData.id = _this.articleId;
			}

			$.ajax({
				url : _this.url,
				type : 'post',
				data : postData,
				success : function(result){
					if(!result.success){
						util.dialog.errorDialog('提交失败请重试');
						return;
					}

					var id = '';
					if(result.data && result.data.insertId){
						id = result.data.insertId;	
					}
					
					if(!id){
						id = _this.articleId;
					}
					util.dialog.confirmDialog('继续提交',
						function(){
							window.location.href = window.location.href;
						},
						function(){
							if(id){
								window.location.href = 'admin/article/detail/' + id;	
							}else{
								window.location.href = window.location.href;
							}
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