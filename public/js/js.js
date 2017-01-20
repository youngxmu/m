// JavaScript Document
$(function(){
	//导航最后一个没有背景
	$(".nav li:last").css("background","none");
	//new1imgSmaill li最后一个没有margin
	$(".new1imgSmaill li:last").css("margin","0");
	//new1img 选项卡
	$(".new1imgBig img:first").show();
	$(".new1imgSmaill li").mousemove(function(){
		var new1img=$(this).index();
		$(".new1imgBig img").eq(new1img).show().siblings(".new1imgBig img").hide();
		})
	//.new1Title 选项卡
	$(".new1New:first").show();
	$(".new1Title li:first").addClass("new1Titlestyle");
	$(".new1Title li").mousemove(function(){
		$(this).addClass("new1Titlestyle").siblings("li").removeClass("new1Titlestyle");
		var new1Title=$(this).index();
		$(".new1New").eq(new1Title).show().siblings(".new1New").hide();
		})
	//新闻折叠
	$(".newList:first").show();
	$(".newTitle").mouseover(function(){
		$(this).next(".newList").show().siblings(".newList").hide();
		})

		
	//.new3LeftTitle li选项卡
	$(".new3LeftTitle li:last span").css("background","none");
	$(".new3LeftTitle li:first").addClass("new3LeftTitlestyle");
	$(".new3LeftBox:first").show();
	$(".new3LeftTitle li").mousemove(function(){
		$(this).addClass("new3LeftTitlestyle").siblings("li").removeClass("new3LeftTitlestyle");
		var new3LeftBox=$(this).index();
		$(".new3LeftBox").eq(new3LeftBox).show().siblings(".new3LeftBox").hide();
		})
	
	//.eduCont dl
	$(".eduCont dl:odd").css("margin-right","0");
	})
	
	
	
					
$(function(){       
//判断浏览器是否支持placeholder属性
   supportPlaceholder='placeholder'in document.createElement('input'),     
   placeholder=function(input){       
      var text = input.attr('placeholder'),     
      defaultValue = input.defaultValue;       
      if(!defaultValue){         
            input.val(text).addClass("phcolor");     
       }      
	 input.focus(function(){        
    	if(input.val() == text){             
			$(this).val(""); }    
		});          
		input.blur(function(){         if(input.val() == ""){                 $(this).val(text).addClass("phcolor");       }     });       //输入的字符不为灰色 
       input.keydown(function(){          $(this).removeClass("phcolor");     });   };     
	   //当浏览器不支持placeholder属性时，调用placeholder函数 
	     if(!supportPlaceholder){       $('input').each(function(){         text = $(this).attr("placeholder");         if($(this).attr("type") == "text"){           placeholder($(this));       }     });   }   }); 


	
	