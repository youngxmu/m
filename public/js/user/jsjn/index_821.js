(function(P){
	var _this = null;
	_this = P.user.jsjn.index = {
		tpl : {},
		init : function(){
			_this['xxrj'].init();
			_this.tpl.menuTpl = juicer($('#menu-tpl').html());
			_this.tpl.menuContentTpl = juicer($('#menu-content-tpl').html());
			_this.tpl.menuContent3Tpl = juicer($('#menu-content3-tpl').html());
			_this.initEvent();
			_this.initMenu();
			_this.onSelMenu({init:true})
		},
		initEvent : function(){
			$('body #main_sys').on('click', '#menu_bar.res-menu li', _this.onSelMenu);
			$('body #main_sys').on('click', '#menu_content .main-menu-list li', _this.onSelMenuList);
		},
		initMenu : function(){
			var menuList = nc.menu;
			var html = _this.tpl.menuTpl.render({list: menuList});
			$('#menu_bar').html(html);
		},
		onSelMenu : function(options){
			var $this = $(this);
			if(options && options.init){
				$this = $('#main_sys #menu_bar li').first();
			}
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var menu = nc.menu[menuIndex];
			// console.log(menu);
			var html = '';
			if(menu.content.jie){
				html += _this.tpl.menuContentTpl.render(menu.content);	
			}

			if(menu.content.videos){
				html += _this.tpl.menuContent3Tpl.render(menu.content);	
			}
			

			$('#menu_content').html(html);
		},
		onSelMenuList : function(){
			var $this = $(this);
			var sysType = $this.attr('data-type');
			// console.log(sysType);
			var subIndex = $this.attr('data-index');
			_this[sysType].show(subIndex);
		},
		getImgStyle : function(defaultImg){
			// console.log(defaultImg);
			if(!defaultImg){
				return console.log(defaultImg);
			}
			var tail = defaultImg.split('[')[1];
			var size = tail.split('x');
			var width = size[0];
			var height = size[1];
			return 'height:' + height + 'px;width:'+ width +'px;';
		}

	};
	juicer.register('getImgStyle', _this.getImgStyle);
})(moka);

(function(P){
	var _this = null;
	_this = P.user.jsjn.index.xxrj = {
		tpl : {},
		init : function(){
			_this.tpl.menuTpl = juicer($('#menu-tpl').html());
			_this.tpl.menuContentTpl = juicer($('#menu-content-tpl').html());
			_this.tpl.ssmenuContentTpl = juicer($('#ss-menu-content-tpl').html());
			_this.menu = nc.xxrj.menu;
			_this.initEvent();
		},
		initEvent : function(){
			$('body #sub_sys').on('click', ' .res-menu li', _this.onSelMenu);
			$('body #sub_sys').on('click', '#sub_menu_content .main-list li', _this.onSelMenuList);
			$('body #sub_sys').on('click', ' .sub-exit', _this.exit);
			$('body #sub_sys').on('click', ' .sub-back', _this.back);
		},
		show : function(mindex){
			_this.initMenu();
			_this.onSelMenu({init:true,index:mindex})
			$('#sub_sys').show().siblings('div').hide();
		},
		initMenu : function(){
			var menuList = _this.menu;
			var html = _this.tpl.menuTpl.render({list: menuList});
			$('#sub_menu_bar').html(html);
		},
		onSelMenu : function(options){
			var $this = $(this);
			if(options && options.init){
				if(options.index){
					var index = options.index;
					$this = $('#sub_sys #sub_menu_bar li').eq(index);	
				}else{
					$this = $('#sub_sys #sub_menu_bar li').first();	
				}
			}
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var menu = _this.menu[menuIndex];
			// console.log(menu);
			_this.cindex = menuIndex;

			var html = _this.tpl.menuContentTpl.render(menu.content);
			if(menu.content.style == 2){
				menu.content.sysType = 'ss';
				html = _this.tpl.ssmenuContentTpl.render(menu.content);
			}
			$('#sub_menu_content').html(html);
		},
		onSelMenuList : function(){
			var $this = $(this);
			var sysType = $this.attr('data-type');
			var subIndex = $this.attr('data-index');
			console.log(sysType);
			var options = {
				sysType : sysType,
				cindex : _this.cindex,
				subIndex : subIndex,
			};
			
			if(sysType && sysType == 'ss'){
				_this.sub.show(options);
			}else{
				_this.detail.show(options);
			}
		},
		back : function(){
			// $('#sub_sys').show().siblings('div').hide();
			$('#main_sys').show().siblings('div').hide();
		},
		exit : function(){
			$('#main_sys').show().siblings('div').hide();
		}
	};
})(moka);



(function(P){
	var _this = null;
	_this = P.user.jsjn.index.xxrj.sub = {
		tpl : {},
		init : function(){
			_this.tpl.menuTpl = juicer($('#menu-tpl').html());
			_this.tpl.menuContentTpl = juicer($('#menu-content-tpl').html());
			_this.tpl.menuContent2Tpl = juicer($('#menu-content2-tpl').html());
			_this.initEvent();
		},
		initEvent : function(){
			$('body #ss_sys').on('click', ' .res-menu li', _this.onSelMenu);
			$('body #ss_sys').on('click', '#ss_menu_content .main-list li', _this.onSelMenuList);
			$('body #ss_sys').on('click', ' .ss-exit', _this.exit);
			$('body #ss_sys').on('click', ' .ss-back', _this.back);
			$('body #ss_sys').on('click', ' .menu-start', _this.onStart);
		},
		show : function(options){
			var cindex = 'c' + (parseInt(options.cindex) + 1);
			var sindex = parseInt(options.subIndex) + 1;
			cindex = cindex + sindex;
			_this.cindex = cindex;
			// console.log(cindex);
			_this.menu = nc.xxrj[cindex].menu;
			_this.initMenu();

			_this.onSelMenu({init:true})
			$('#ss_sys').show().siblings('div').hide();
		},
		initMenu : function(){
			var menuList = _this.menu;
			var html = _this.tpl.menuTpl.render({list: menuList});
			$('#ss_menu_bar').html(html);
		},
		onSelMenu : function(options){
			var $this = $(this);
			if(options && options.init){
				if(options.index){
					var index = options.index;
					$this = $('#ss_sys #ss_menu_bar li').eq(index);	
				}else{
					$this = $('#ss_sys #ss_menu_bar li').first();	
				}
			}
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var menu = _this.menu[menuIndex];
			var html = '';
			if(menu.content.style == 3){
				html = _this.tpl.menuContent2Tpl.render(menu.content);
			}
			$('#ss_menu_content').html(html);
		},
		onStart : function(){
			var $this = $(this);
			var click = $this.attr('data-click');
			var options = {
				cindex : _this.cindex,
				click : click
			}
			P.user.jsjn.index.xxrj.ssdetail.show(options);
		},
		onSelMenuList : function(){
			
		},
		back : function(){
			// $('#sub_sys').show().siblings('div').hide();
			$('#main_sys').show().siblings('div').hide();
		},
		exit : function(){
			$('#main_sys').show().siblings('div').hide();
		}
	};
})(moka);

(function(P){
	var _this = null;
	_this = P.user.jsjn.index.xxrj.detail = {
		page : {
			totalCount : 1,
			pageNo : 1
		},
		tpl : {},
		init : function(){
			_this.tpl.menuTpl = juicer($('#detail-menu-tpl').html());
			_this.tpl.menuContentTpl = juicer($('#detail-content-tpl').html());
			_this.initEvent();
		},
		initEvent : function(){
			$('body').on('click', ' #detail_sys.s .detail1-res-menu li', _this.onSelMenu);
			$('body').on('click', ' #detail_sys.s .detail-page-pre',  _this.pre);
			$('body').on('click', ' #detail_sys.s .detail-page-next', _this.next);
			$('body').on('click', ' #detail_sys.s .detail-page-first',  _this.first);
			$('body').on('click', ' #detail_sys.s .detail-page-last', _this.last);
			$('body').on('click', ' #detail_sys.s .detail-exit', _this.exit);
			$('body').on('click', ' #detail_sys.s .detail-back', _this.back);

			// $('body').on('click', ' #detail_sys.ss .detail-exit', _this.exit);
			// $('body').on('click', ' #detail_sys.ss .detail-back', function(){
			// 	$('#ss_sys').show().siblings('div').hide();
			// });
		},
		show : function(options){
			$('#detail_sys').addClass('s').removeClass('ss');;
			var cindex = 'c' + (parseInt(options.cindex) + 1);
			var jindex = options.subIndex;
			console.log(cindex);
			_this.menu = nc.xxrj[cindex].menu;
			_this.initMenu();


			var $this = $('#detail_menu_bar').find('li').first();
			if(jindex){
				$this = $('#detail_menu_bar').find('li').eq(jindex);
			}
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var data = _this.menu;
			var jie = _this.menu.jie[menuIndex];
			data.detailMenuStyle = 1;
			data.content =  jie.content;
			_this.page.pageNo = 1;
			_this.page.totalCount = data.content.length;
			var html = _this.tpl.menuContentTpl.render(data);
			$('#detail_menu_content').html(html);


			$('#detail_sys').show().siblings('div').hide();
		},
		initMenu : function(){
			var menuList = _this.menu;
			_this.menu.detailMenuStyle = 1;
			var html = _this.tpl.menuTpl.render( _this.menu);
			$('#detail_menu_bar').html(html);
		},
		onSelMenu : function(){
			var $this = $(this);
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var data = _this.menu;
			var jie = _this.menu.jie[menuIndex];
			data.content =  jie.content;
			_this.page.pageNo = 1;
			_this.page.totalCount = data.content.length;
			var html = _this.tpl.menuContentTpl.render(data);
			$('#detail_menu_content').html(html);
		},
		getCurrPage : function(){
			return $('#detail_menu_content').find('.current');
		},
		goPage : function(index){
			var $page = $('#detail_menu_content .content-list .content').eq(index);
			$('#page_no').val(parseInt(index) + 1);
			$page.addClass('current').siblings('li').removeClass('current');
		},
		first : function(){
			_this.goPage(0);
		},
		last : function(){
			_this.goPage(_this.page.totalCount - 1);
		},
		pre : function(){
			var $pre = _this.getCurrPage().prev('.content');
			var index = $pre.attr('data-index');
			if($pre.length == 1){
				_this.goPage(index);
			}
		},
		next : function(){
			var $next = _this.getCurrPage().next('.content');
			var index = $next.attr('data-index');
			if($next.length == 1){
				_this.goPage(index);
			}
		},
		back : function(){
			$('#sub_sys').show().siblings('div').hide();
		},
		exit : function(){
			$('#main_sys').show().siblings('div').hide();
		}
	};
})(moka);



(function(P){
	var _this = null;
	_this = P.user.jsjn.index.xxrj.ssdetail = {
		page : {
			totalCount : 1,
			pageNo : 1
		},
		tpl : {},
		init : function(){
			_this.tpl.menuTpl = juicer($('#detail-menu-tpl').html());
			_this.tpl.menu2Tpl = juicer($('#detail-menu2-tpl').html());
			
			_this.tpl.menuContentTpl = juicer($('#detail-content-tpl').html());
			_this.initEvent();
		},
		initEvent : function(){
			$('body').on('click', ' #detail_sys.ss .detail2-res-menu li', _this.onSelMenu);
			$('body').on('click', ' #detail_sys.ss .detail-exit', _this.exit);
			$('body').on('click', ' #detail_sys.ss .detail-back', _this.back);
		},
		show : function(options){
			$('#detail_sys').addClass('ss').removeClass('s');
			var cindex = options.cindex;
			var click = options.click;
			console.log(cindex+' '+ click);
			_this.menu = nc.xxrj[cindex].details[click].menu;
			_this.menu.detailMenuStyle = 2;
			_this.initMenu();

			// console.log(_this.menu);
			var $this = $('#detail_menu_bar').find('li').first();
			
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var data = _this.menu;
			var html = '';
			if(_this.menu.jie){
				var jie = _this.menu.jie[menuIndex];
				data.content =  jie.content;
				_this.page.pageNo = 1;
				_this.page.totalCount = data.content.length;
				html = _this.tpl.menuContentTpl.render(data);
			}

			if(_this.menu.mjie){
				var strs = menuIndex.split('-');
				var jIndex = strs[0];
				var mIndex = strs[1];
				var jie = _this.menu.mjie[jIndex].menu[mIndex];

				data.content =  jie.content;
				_this.page.pageNo = 1;
				_this.page.totalCount = data.content.length;
				html = _this.tpl.menuContentTpl.render(data);
			}
			
			
			$('#detail_menu_content').html(html);
			$('#detail_sys').show().siblings('div').hide();
		},
		initMenu : function(){
			var menuList = _this.menu;
			var html = '';
			html = _this.tpl.menuTpl.render( _this.menu);
			if(_this.menu.mjie){
				html = _this.tpl.menu2Tpl.render( _this.menu);
			}
			$('#detail_menu_bar').html(html);
		},
		onSelMenu : function(){
			var $this = $(this);
			$this.addClass('active').siblings('li').removeClass('active');
			var menuIndex = $this.attr('data-index');
			var data = _this.menu;
			var html = '';
			if(_this.menu.jie){
				var jie = _this.menu.jie[menuIndex];
				data.content =  jie.content;
				_this.page.pageNo = 1;
				_this.page.totalCount = data.content.length;
				html = _this.tpl.menuContentTpl.render(data);
			}

			if(_this.menu.mjie){
				var strs = menuIndex.split('-');
				var jIndex = strs[0];
				var mIndex = strs[1];
				var jie = _this.menu.mjie[jIndex].menu[mIndex];

				data.content =  jie.content;
				_this.page.pageNo = 1;
				_this.page.totalCount = data.content.length;
				html = _this.tpl.menuContentTpl.render(data);
			}
			$('#detail_menu_content').html(html);
		},
		getCurrPage : function(){
			return $('#detail_menu_content').find('.current');
		},
		goPage : function(index){
			var $page = $('#detail_menu_content .content-list .content').eq(index);
			$('#page_no').val(parseInt(index) + 1);
			$page.addClass('current').siblings('li').removeClass('current');
		},
		first : function(){
			_this.goPage(0);
		},
		last : function(){
			_this.goPage(_this.page.totalCount - 1);
		},
		pre : function(){
			var $pre = _this.getCurrPage().prev('.content');
			var index = $pre.attr('data-index');
			if($pre.length == 1){
				_this.goPage(index);
			}
		},
		next : function(){
			var $next = _this.getCurrPage().next('.content');
			var index = $next.attr('data-index');
			if($next.length == 1){
				_this.goPage(index);
			}
		},
		back : function(){
			$('#ss_sys').show().siblings('div').hide();
		},
		exit : function(){
			$('#main_sys').show().siblings('div').hide();
		}
	};
})(moka);

moka.user.jsjn.index.xxrj.sub.init();
moka.user.jsjn.index.xxrj.detail.init();
moka.user.jsjn.index.xxrj.ssdetail.init();
// moka.user.jsjn.index.xxrj.sub.show({cindex:2,subIndex:1});
// moka.user.jsjn.index.xxrj.ssdetail.show({cindex:'c32',click:'sxybx'});
