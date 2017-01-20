(function(P){
	var _this = null;
	_this = P.article.list = {
		searchUrl : 'article/queryArticleByMenu',
		tpl : {
			articleListTpl : null
		},
		data : {
			userMap : {}
		},
		queryData : {
			pageNo : 1,
			pageSize : 10
		},
		init : function() {
			_this.mid = $('#mid').val();
			_this.tpl.twopTpl = juicer($('#twop_tpl').html());
			_this.tpl.onepTpl = juicer($('#onep_tpl').html());
			
			_this.tpl.articleListTpl = juicer($('#article_list_tpl').html());
			_this.initEvent();
			_this.initMenu();
		},
		initEvent : function(){
			$('.nav').on('click', 'span', function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				var mid = $this.attr('data-id');
				_this.initView(mid);
				// _this.queryData.mid = $this.attr('data-id');

				// _this.search();
			});
			$('#main_list').on('click', '.twop-nav span', function(){
				var $this = $(this);
				$this.addClass('active').siblings().removeClass('active');
				var mid = $this.attr('data-id');
				_this.queryData.mid = $this.attr('data-id');
				_this.search();
			});

			$('#btn_commit').on('click', _this.commit);
		},
		initMenu : function(){
			var $nav = $('.nav');
			var $spans = $nav.find('span')
			if($spans.length == 0){
				var html = _this.tpl.onepTpl.render({leafMenus : []});
				$('#main_list').html(html);
				$('#article_list').html(P.building);
				return;
			}
			$.ajax({
				type : 'get',
				url : 'menu/map',
				success : function(menuMap){
					_this.menuMap = menuMap;
					var fmid = $nav.find('span').first().attr('data-id');
					 _this.initView(fmid);
				}
			});
		},
		initView : function(fmid){
			var menuMap = _this.menuMap;
			var fMenu = menuMap[fmid];
			var submenu = fMenu.submenu;
		    var leafMenus = [];
		    var html = '';
		    if(submenu && submenu.length > 0){
		        for(var index in submenu){
		            var sid = submenu[index];
		            var midmenu = menuMap[sid];
		            leafMenus.push(midmenu);
		        }
		        html = _this.tpl.twopTpl.render({leafMenus : leafMenus});
		    }else{
	    	 	html = _this.tpl.onepTpl.render({leafMenus : leafMenus});
		    }
		    $('#main_list').html(html);
		    _this.queryData.mid = fmid;
		    _this.search();
		},
		loadList : function(){

		},
		search : function(){
			$.ajax({
				type : 'post',
				url : _this.searchUrl,
				data : _this.queryData,
				beforeSend : function(){
					$('#article_list').html(util.loadingPanel);
				},
				success : _this.initPage
			});
		},
		initPage : function(result) {
			var data = result.data;
		    $('#article_list').html(_this.tpl.articleListTpl.render(data));

			var userList = data.list;
			for(var index in userList){
				var user = userList[index];
				_this.data.userMap[user.id] = user;
			}
		
			var totalPage = data.totalPage;
			var totalCount = data.totalCount;

			if(totalCount == 0){
				$('#article_list').html(P.building);
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
		                    if (_this.instance_papers == null)
		                    	_this.instance_papers = this;
	
		                    _this.queryData.pageNo = parseInt(pageNo),

		                    $.ajax({
		                    	url:  _this.searchUrl,
		                        type: 'POST',
		                        data: _this.queryData,
		                        beforeSend : function(){
									$('#article_list').html(util.loadingPanel);
								},
		                        success : function(result){
		                        	if (result != null && result.success) {
		                        		var data = result.data;
		                		        $('#article_list').html(_this.tpl.articleListTpl.render(data));
										var userList = data.list;
										for(var index in userList){
											var user = userList[index];
											_this.data.userMap[user.id] = user;
										}
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
		}
	};
}(moka));