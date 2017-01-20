(function(P){
	var _this = null;
	_this = P.index.honor = {
		searchUrl : 'index/about/personal',
		tpl : {},
		data : {},
		init : function() {
			_this.data.type = $('#type').val();
			if(_this.data.type == 'u'){
				_this.searchUrl = 'index/about/org';
			}
			_this.tpl.listTpl = juicer($('#list_tpl').html());
			_this.tpl.picTpl = juicer($('#pic_tpl').html());
			_this.initEvent();
			_this.loadHonors();
		},
		initEvent : function(){
			$('#resource_list').on('click','.view',function(){
				var id = $(this).attr('data-id');
				var data = _this.data.resourceList[id];
				var options = {isPreview : false, resourceType : 2};
			});
		},
		loadHonors : function(key, keyValue){
			var $listPanel = $('#list_panel');
			var $picPanel = $('#pic_panel');
			$.ajax({
				type : 'post',
				src : _this.searchUrl,
				beforeSend : function(){
					$listPanel.html(util.loadingPanel);
					$picPanel.html(util.loadingPanel);
				},
				success : function(result){
					if(result.success){
				    	$listPanel.html(_this.tpl.listTpl.render(result));
				    	$picPanel.html(_this.tpl.picTpl.render(result));

				    	_this.initPlayer();
					}
					
				}
			});
		},
		initPlayer : function(){
			function scrollTxt(){
				var controls={}, 
					values={},
					t1=300, /*播放动画的时间*/
					t2=1500, /*播放时间间隔*/
					si;
				controls.rollWrap=$(".pic-panel");
				controls.rollWrapUl=controls.rollWrap.children();
				controls.rollWrapLIs=controls.rollWrapUl.children();
				values.liNums=controls.rollWrapLIs.length;
				values.liHeight=controls.rollWrapLIs.eq(0).width();
				values.ulHeight=controls.rollWrap.width();
				this.init=function(){
					autoPlay();
					pausePlay();
				}
				/*滚动*/
				function play(){
					controls.rollWrapUl.animate({"margin-left" : "-"+values.liHeight}, t1, function(){
						$(this).css("margin-left" , "0").children().eq(0).appendTo($(this));
					});
				}
				/*自动滚动*/
				function autoPlay(){
					/*如果所有li标签的高度和大于.roll-wrap的高度则滚动*/
					if(values.liHeight*values.liNums > values.ulHeight){
						si=setInterval(function(){
							play();
						},t2);
					}
				}
				/*鼠标经过ul时暂停滚动*/
				function pausePlay(){
					controls.rollWrapUl.on({
						"mouseenter":function(){
							clearInterval(si);
						},
						"mouseleave":function(){
							autoPlay();
						}
					});
				}
			}
			new scrollTxt().init();
		}
	};
}(moka));