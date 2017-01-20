(function(P){
	var _this = null;
	_this = P.admin.expert.edit = {
		searchUrl : 'expert/result',
		expertId : null,
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		tpl : {

		},
		data : {
		},
		init : function() {
			_this.expertId = $('#expertId').val();
			_this.tpl.resultListTpl = juicer($('#result-list-tpl').html());
			_this.initEvent();

			$('#birthday').datetimepicker({
				language : 'zh-CN',
				startView : 'year',
				format : 'yyyy-mm-dd',
				viewSelect : 2,
	    		minView : 2,
	    		autoclose : true
	    	});

	    	var fileTypeFilters = [];
			for(var type in P.fileType){
				fileTypeFilters.push(type);
			}
			_this.initUploader('/upload/img', fileTypeFilters.join(','));
		},
		initEvent : function(){
			$('#btn_commit').on('click', _this.commit);
			$('body').on('click', '.nav-tabs li', _this.changeType);
			$('body').on('click', '.oper .del',_this.onDel);
			$('body').on('click', '#add_result', function(){
				window.open('admin/expert/result/add/' + _this.expertId + '?type=' + _this.queryData.type);				
			});
		},
		changeType : function(){
			var $this = $(this);
			if(!_this.expertId){
				$('#info_panel').show();
				return;
			}
			$this.addClass('active').siblings('li').removeClass('active');
			var type = $this.attr('data-type');
			$('#info_panel').hide();
			$('#list_panel').hide();
			if(type == 1 ){
				$('#info_panel').show();
			}

			if(type == 2){
				_this.queryData.id = _this.expertId;
				_this.queryData.type = 1;
				_this.loadRes();
				$('#list_panel').show();	
			}
			if(type == 3){
				_this.queryData.id = _this.expertId;
				_this.queryData.type = 2;
				_this.loadRes();
				$('#list_panel').show();
			}
		},
		commit : function() {
			var data = {};
			var $inputs = $('#info_panel').find('input,select,textarea');
			$inputs.each(function(){
				var $this = $(this);
				var key = $this.attr('name');
				var value = $this.val();
				if($this.attr('type') == 'radio'){
					if($this.is(':checked')){
						data[key] = value;		
					}
				}else{
					data[key] = value;	
				}
			});
			if(_this.expertId != null){
				data.id = _this.expertId;
			}

			$.ajax({
				url : 'admin/expert/save',
				type : 'post',
				data : data,
				success : function(result){
					if(!result.success){
						util.dialog.errorDialog('提交失败请重试');
						return;
					}
					util.dialog.infoDialog('提交成功');
					if(result.data && result.data.insertId){
						window.location.href = 'admin/expert/edit/' + result.data.insertId;
					}
				},
				error : function(){
					util.dialog.errorDialog('提交失败请重试');
				}
			});
		},
		loadRes : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#resource_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			if(!result.success){
				return;
			}
			var data = result.data;
		    $('#resource_list').html(_this.tpl.resultListTpl.render(data));
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#resource_list').html(P.building);
				return;
			}

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
		                    if (_this.instance_xs == null)
		                    	_this.instance_xs = this;
	
		                    _this.queryData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#resource_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#resource_list').html(_this.tpl.resultListTpl.render(data));
		                		    }
		                		    else {
		                		        util.dialog.infoDialog("查询信息失败，请重试。");
		                		    }
		                        }
		                    });
		                }
		            });
		        });
		    }
		},
		onDel : function(){
			var $this = $(this);
			var id = $this.attr('data-id');
			var d = dialog({
			    title: '删除测评',
			    content: '确认删除',
			    okValue : '确定',
			    ok : function(){
                    $.ajax({
						type : 'post',
						url : 'admin/expert/result/del',
						data : {id : id},
						success : function(result){
							_this.loadRes();
						}
					});
			    },
			    cancelValue : '取消',
			    cancel : function(){}
			});
			d.showModal();
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
						$('#btn_upload').text('修改文件');
						_this.fileUploader.disableBrowse(false);
						var data = eval('(' + info.response + ')');
						_this.fileName = data.fileName;
						_this.filePath = data.filePath;
						if (data.success == false) {
							util.dialog.infoDialog(data.msg);
							return;
						} else {
							util.dialog.toastDialog('上传成功', 2000, function(){
								$('#process_bar').hide();
								$('#process_rate').css('width', '0');
								$('#process_rate').text('0%');
							});
							
							$('#avatar').val(_this.fileName);
							$('#btn_upload').html('<img src="' + _this.filePath + '" class="img-thumbnail">');
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
						// $('#filename').text(orgName).show();
						_this.fileUploader.start();
					},
					BeforeUpload : function(up, file) {
						_this.fileUploader.disableBrowse(true);
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