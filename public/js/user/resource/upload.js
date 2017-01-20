(function(P){
	var _this = null;
	_this = P.user.resource.upload = {
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


			var fileTypeFilters = [];
			for(var type in P.fileType){
				fileTypeFilters.push(type);
			}
			_this.initUploader('/upload/file', fileTypeFilters.join(','));
			
		},
		initEvent : function(){
			$('#btn_commit').on('click', _this.commit);
			$('.u-select-p').on('change', '.menu-s', function(){
				_this.changeMenu($(this));
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
				    		menuList.push(menu);
				    	}
				    }
					var html = '';
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
			var url = 'resource/save';
			
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
				url : url,
				type : 'post',
				data : postData,
				success : function(data){
					util.dialog.confirmDialog('继续提交',
						function(){
							window.location.href = window.location.href;
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