var component = {};
(function(component){
	var _this = null;
	_this = component.imgFSPlayer = {
		panel : 
			'<div id="img_fs_panel" >' +
			'<div class="img-player-fs-mask" ></div>' +
			'<div class="header-player-fs">'+
			'<a id="btn_img_player_fs_close" class="btn_round_blue30" href="javascript:void(0);">关闭</a>'+
			'<a id="btn_img_player_fs_rotate" class="btn_round_blue30" href="javascript:void(0);">旋转</a>'+
			'</div>'+
			'<div id="img_player_fs_panel" class="img-player-fs">'+
	      		'<ul style="text-align:center;padding: 0 5%;width:90%;">'+
	        	    '<li style="float:none;"><img src="/img/ico/loading.gif"></li>'+
	    	    '</ul>'+
	    	    '<div class="page"><span>1</span> / 1</div>'+
				'<a id="btn_fs_prev" class="page_lf" href="javascript:;"></a>'+
				'<a id="btn_fs_next" class="page_rt" href="javascript:;"></a>'+
		  	'</div>'+
		  	'</div>'
		,
		init : function(options){
			var $target = $('#img_player_fs_panel');
			if($target.length == 0){
				$('body').append(_this.panel);
				$target = $('#img_player_fs_panel');
			}

			
				
			var $btnPrev = $('#btn_fs_prev'); 
			var $btnNext = $('#btn_fs_next');
			var imgList = options.imgList;
			var totalCount = imgList.length;
			var currIndex = 1;
			if(options.currIndex){
				currIndex = options.currIndex;
			}
			if(options.renderCallback){
				$target.data('renderCallback', options.renderCallback);
			}
			

			$target.find('.page').html('<span>1</span> / ' + imgList.length);

			$target.data('imgList', imgList);
			$target.data('totalCount', totalCount);
			$target.data('currIndex', currIndex);
			$target.data('btnPrevId', 'btn_fs_prev');
			$target.data('btnNextId', 'btn_fs_next');

			$btnPrev.click(function(){_this.prev($target);});
			$btnNext.click(function(){_this.next($target);});

			$('#btn_img_player_fs_close').click(function(){
				$('#img_fs_panel').remove();
			});
			
			$('#btn_img_player_fs_rotate').click(function(){
				var $img = $target.find('img');
				var className = $img.attr('class');

				if(!className || className == ''){
					className = 'rotate90';
				}else{
					var angle = className.substr(6);
					angle = parseInt(angle, 10) + 90;
					if(angle == 360){
						className = '';
					}else{
						className = 'rotate' + angle;
					}
				}

				$img.attr('class', className);
			});

			_this.renderImg($target);

			$target.show();
			$('#img_fs_panel').show();

		},
		prev : function($target){
			var currIndex = $target.data('currIndex');
			var totalCount = $target.data('totalCount');
			if (currIndex == 1) {
				return;
			} else{
				currIndex--;
				$target.data('currIndex', currIndex);
				_this.renderImg($target);
			}
		},
		next : function($target){
			var currIndex = $target.data('currIndex');
			var totalCount = $target.data('totalCount');

			if (currIndex == totalCount) {
				return;
			} else{
				currIndex++;
				$target.data('currIndex', currIndex);
				_this.renderImg($target);
			}
		},
		renderImg : function($target){
			var currIndex = $target.data('currIndex');
			var imgList = $target.data('imgList');
			var currImgSrc = imgList[currIndex - 1];

			$target.find('img').attr('src', '/img/loading.gif');

			$target.find('.page').find('span').text(currIndex);

			var callback = $target.data('renderCallback');
			if(callback){
				callback(currIndex);
			}
			
			var img = new Image();

	        img.onload = function () {
	            $target.find('img').attr('src', currImgSrc);

	            var $btnPrev = $('#' + $target.data('btnPrevId')); 
				var $btnNext = $('#' + $target.data('btnNextId')); 

				if (currIndex == 1) {
					$btnPrev.addClass('page_lf_first');
				} else{
					$btnPrev.removeClass('page_lf_first');
				}
				if (currIndex == imgList.length) {
					$btnNext.addClass('page_rt_last');
				}else{
					$btnNext.removeClass('page_rt_last');
				}
				
				if(imgList.length == 1){
					$btnPrev.remove();
					$btnNext.remove();
				}

				var width = $target.width();
				var height = $target.height();

				var $li = $target.find('img').parent('li');
				var liWidth = $li.width();
				var liHeight = $li.height();
				if(liHeight < height){
					$li.css('margin-top', (height - liHeight)/2);
				}else{
					$li.css('margin-top', 0);
				}
				
				$('#curr_page_no').text(currIndex);
	        };
	        img.src = currImgSrc;
		}
	};
}(component));
(function(component){
	var _this = null;
	_this = component.chart = {
		callback : function(){},
		questionTpl : '<div class="question-list"><div class="qbody">${qbody}</div>{@if qtype == 2 || qtype == 3}<div class="qanswer">$${qanswer|formatCanvasAnswer}</div>{@/if}</div>',
		paperId : null,
		questions : null,
		historys : null,
		data : {

		},
		randomScalingFactor : function() {
            return 1;
        },
        randomColorFactor : function() {
            return Math.round(Math.random() * 255);
        },
        randomColor : function() {
            return 'rgba(' + _this.randomColorFactor() + ',' + _this.randomColorFactor() + ',' + _this.randomColorFactor() + ',.7)';
        },
        show : function(options){
        	_this.paperId = options.paperId;
			if(options.callback)
				_this.callback = options.callback;
			_this.chartId = options.chartId;
			
			var content = '<div id="canvas_question_panel" style="display:inline-block;width:400px;float:left;margin-right:30px;"></div><div style="width:300px;height:300px;display:inline-block"><canvas id="canvas" width="400" height="400"></canvas></div>';
        	var d = dialog({
			    title: '答题统计',
			    content: content,
			    okValue : '关闭',
			    width : 800,
			    onshow : function(){
			    	_this.getData(function(msg){
			    		d.close();
			    		util.dialog.infoDialog(msg);
			    	});
			    },
			    ok : function(){},
			    button: [
			        {
			            value: '上一题',
			            callback: function () {
			                _this.prev();
			                return false;
			            }
			        } ,
			        {
			            value: '下一题',
			            callback: function () {
			                _this.next();
			                return false;
			            }
			        } 
		        ]
			});
			d.showModal();
        },
		getData : function(callback){
	 		$.ajax({
				url : 'vote/history/' + _this.paperId,
				type : 'post',
				success : function(data){
					if(data.success){
						var questions = data.vote.questions;
						var historys = data.vote.historys;
						_this.questions = questions;
						_this.historyMap = {};
						for(var index in historys){
							var history = historys[index];
							if(!_this.historyMap[history.qid]){
								_this.historyMap[history.qid] = {};
							}
							_this.historyMap[history.qid][history.answer] = history.count;
						}

				        
						var ctx = document.getElementById(_this.chartId).getContext("2d");
						var data = _this.getQuestionData(questions[0]);
						_this.questionIndex = 0;
        
						var options = {};
						_this.myBar = new Chart(ctx, {
			                type: 'bar',
			                data: data,
			                width : '400px',
			                options: {
			                    barPercentage : 0.2,
			                    elements: {
			                    	barPercentage : 0.2,
			                        rectangle: {
			                            borderWidth: 2,
			                            borderColor: 'rgb(0, 255, 0)',
			                            borderSkipped: 'bottom'
			                        }
			                    },
			                    responsive: true,
			                    legend: {
			                        position: 'top',
			                    },
			                    title: {
			                        display: false,
			                        text: '数据统计'
			                    }
			                }
			            });
					}else{
						callback(data.msg);
						// util.dialog.infoDialog(data.msg);
					}
				}
			});
	 	},
	 	nameArr : ['A','B','C','D','E','F','G','H'],
	 	getQuestionData : function(question){
	 		var tpl = juicer(_this.questionTpl);

	 		$('#canvas_question_panel').html(tpl.render(question));
	 		var qanswers = question.qanswer.split(',');
	 		var length = qanswers.length;
	 		var labels = [];
	 		var backgroundColor = [];
	 		var data = [];
	 		for(var i=0;i<length;i++){
	 			var answerName = _this.nameArr[i];
	 			labels.push(answerName);
	 			backgroundColor.push(_this.randomColor());
	 			var count = _this.historyMap[question.id][answerName];
	 			if(!count){
	 				count = 0;
	 			}
	 			data.push(count);
	 		}
	 		data.push(0);
	 		var questionData = {
	            labels: labels,
	            datasets: [{
	                label: '答题统计',
	                backgroundColor: backgroundColor,
	                data: data
	            }]
	        };
	        return questionData;
	 	},
	 	next : function(){
	 		_this.questionIndex++;
	 		if(_this.questionIndex >= _this.questions.length){
	 			_this.questionIndex = 0;
	 		}
	 		var question = _this.questions[_this.questionIndex];
	 		var data = _this.getQuestionData(question);
	 		_this.myBar.data.labels = data.labels;
	 		_this.myBar.data.datasets = data.datasets;
          	_this.myBar.update();
	 	},
	 	prev : function(){
	 		_this.questionIndex--;
	 		if(_this.questionIndex <= 0){
	 			_this.questionIndex = _this.questions.length - 1;
	 		}
	 		var question = _this.questions[_this.questionIndex];
	 		var data = _this.getQuestionData(question);
	 		_this.myBar.data.labels = data.labels;
	 		_this.myBar.data.datasets = data.datasets;
          	_this.myBar.update();
	 	},
	 	formatCanvasAnswer : function(answerStr){
	 		var answerArr = answerStr.split(',');
			var html = '';

			for(var i in answerArr){
				var index = parseInt(i) + 1;
				var word = util.getOption(index);
				html += '<p>' + word + ':' + answerArr[i] + '</p>';
			}
			return html;
	 	}
	};
	juicer.register('formatCanvasAnswer', _this.formatCanvasAnswer);
}(component));


(function(component){
	var _this = null;
	_this = component.score = {
		callback : function(){},
		questionTpl : '<div class="question-list"><div class="qbody">${qbody}</div>{@if qtype == 2 || qtype == 3}<div class="qanswer">$${qanswer|formatCanvasAnswer}</div>{@/if}</div>',
		paperId : null,
		questions : null,
		historys : null,
		data : {

		},
		randomScalingFactor : function() {
            return 1;
        },
        randomColorFactor : function() {
            return Math.round(Math.random() * 255);
        },
        randomColor : function() {
            return 'rgba(' + _this.randomColorFactor() + ',' + _this.randomColorFactor() + ',' + _this.randomColorFactor() + ',.7)';
        },
        show : function(options){
        	_this.paperId = options.paperId;
			if(options.callback)
				_this.callback = options.callback;
			_this.chartId = options.chartId;
			
			var content = '<div id="canvas_question_panel" style="display:inline-block;width:400px;float:left;margin-right:30px;"></div><div style="width:300px;height:300px;display:inline-block"><canvas id="canvas" width="400" height="400"></canvas></div>';
        	var d = dialog({
			    title: '答题统计',
			    content: content,
			    okValue : '关闭',
			    width : 800,
			    onshow : function(){
			    	_this.getData();
			    },
			    ok : function(){},
			    button: [
			        {
			            value: '上一题',
			            callback: function () {
			                _this.prev();
			                return false;
			            }
			        } ,
			        {
			            value: '下一题',
			            callback: function () {
			                _this.next();
			                return false;
			            }
			        } 
		        ]
			});
			d.showModal();
        },
		getData : function(){
	 		$.ajax({
				url : 'vote/history/' + _this.paperId,
				type : 'post',
				success : function(data){
					if(data.success){
						var questions = data.vote.questions;
						var historys = data.vote.historys;
						_this.questions = questions;
						_this.historyMap = {};
						for(var index in historys){
							var history = historys[index];
							if(!_this.historyMap[history.qid]){
								_this.historyMap[history.qid] = {};
							}
							_this.historyMap[history.qid][history.answer] = history.count;
						}

				        
						var ctx = document.getElementById(_this.chartId).getContext("2d");
						var data = _this.getQuestionData(questions[0]);
						_this.questionIndex = 0;
        
						var options = {};
						_this.myBar = new Chart(ctx, {
			                type: 'bar',
			                data: data,
			                width : '400px',
			                options: {
			                    barPercentage : 0.2,
			                    elements: {
			                    	barPercentage : 0.2,
			                        rectangle: {
			                            borderWidth: 2,
			                            borderColor: 'rgb(0, 255, 0)',
			                            borderSkipped: 'bottom'
			                        }
			                    },
			                    responsive: true,
			                    legend: {
			                        position: 'top',
			                    },
			                    title: {
			                        display: false,
			                        text: '数据统计'
			                    }
			                }
			            });

							
					}else{
						alert(data.msg);
					}
				}
			});
	 	},
	 	nameArr : ['A','B','C','D','E','F','G','H'],
	 	getQuestionData : function(question){
	 		var tpl = juicer(_this.questionTpl);

	 		$('#canvas_question_panel').html(tpl.render(question));
	 		var qanswers = question.qanswer.split(',');
	 		var length = qanswers.length;
	 		var labels = [];
	 		var backgroundColor = [];
	 		var data = [];
	 		for(var i=0;i<length;i++){
	 			var answerName = _this.nameArr[i];
	 			labels.push(answerName);
	 			backgroundColor.push(_this.randomColor());
	 			var count = _this.historyMap[question.id][answerName];
	 			if(!count){
	 				count = 0;
	 			}
	 			data.push(count);
	 		}
	 		data.push(0);
	 		var questionData = {
	            labels: labels,
	            datasets: [{
	                label: '答题统计',
	                backgroundColor: backgroundColor,
	                data: data
	            }]
	        };
	        return questionData;
	 	},
	 	next : function(){
	 		_this.questionIndex++;
	 		if(_this.questionIndex >= _this.questions.length){
	 			_this.questionIndex = 0;
	 		}
	 		var question = _this.questions[_this.questionIndex];
	 		var data = _this.getQuestionData(question);
	 		_this.myBar.data.labels = data.labels;
	 		_this.myBar.data.datasets = data.datasets;
          	_this.myBar.update();
	 	},
	 	prev : function(){
	 		_this.questionIndex--;
	 		if(_this.questionIndex <= 0){
	 			_this.questionIndex = _this.questions.length - 1;
	 		}
	 		var question = _this.questions[_this.questionIndex];
	 		var data = _this.getQuestionData(question);
	 		_this.myBar.data.labels = data.labels;
	 		_this.myBar.data.datasets = data.datasets;
          	_this.myBar.update();
	 	}
	};
}(component));


(function(component){
	var _this = null;
	_this = component.player = {
		panel : 
			'<div id="img_fs_panel" >' +
			'<div class="img-player-fs-mask" ></div>' +
			'<div class="header-player-fs">'+
			'<a id="btn_img_player_fs_close" class="btn_round_blue30" href="javascript:void(0);">关闭</a>'+
			'<a id="btn_img_player_fs_rotate" class="btn_round_blue30" href="javascript:void(0);">旋转</a>'+
			'</div>'+
			'<div id="img_player_fs_panel" class="img-player-fs">'+
	      		'<ul style="text-align:center;padding: 0 5%;width:90%;">'+
	        	    '<li style="float:none;"><img src="/img/ico/loading.gif"></li>'+
	    	    '</ul>'+
	    	    '<div class="page"><span>1</span> / 1</div>'+
				'<a id="btn_fs_prev" class="page_lf" href="javascript:;"></a>'+
				'<a id="btn_fs_next" class="page_rt" href="javascript:;"></a>'+
		  	'</div>'+
		  	'</div>'
		,
		init : function(options){
			var $target = $('#img_player_fs_panel');
			if($target.length == 0){
				$('body').append(_this.panel);
				$target = $('#img_player_fs_panel');
			}
			var $btnPrev = $('#btn_fs_prev'); 
			var $btnNext = $('#btn_fs_next');
			var imgList = options.imgList;
			var totalCount = imgList.length;
			var currIndex = 1;
			if(options.currIndex){
				currIndex = options.currIndex;
			}
			if(options.renderCallback){
				$target.data('renderCallback', options.renderCallback);
			}
			

			$target.find('.page').html('<span>1</span> / ' + imgList.length);

			$target.data('imgList', imgList);
			$target.data('totalCount', totalCount);
			$target.data('currIndex', currIndex);
			$target.data('btnPrevId', 'btn_fs_prev');
			$target.data('btnNextId', 'btn_fs_next');

			$btnPrev.click(function(){_this.prev($target);});
			$btnNext.click(function(){_this.next($target);});

			$('#btn_img_player_fs_close').click(function(){
				$('#img_fs_panel').remove();
			});
			
			$('#btn_img_player_fs_rotate').click(function(){
				var $img = $target.find('img');
				var className = $img.attr('class');

				if(!className || className == ''){
					className = 'rotate90';
				}else{
					var angle = className.substr(6);
					angle = parseInt(angle, 10) + 90;
					if(angle == 360){
						className = '';
					}else{
						className = 'rotate' + angle;
					}
				}

				$img.attr('class', className);
			});

			_this.renderImg($target);

			$target.show();
			$('#img_fs_panel').show();

		}
	};
}(component));

