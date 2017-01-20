/* 
* MyCxcPlug 1.0 
* Copyright (c) 2013 ChenXiaoChuan 157972671
* Date: 2013-09-15
* 多种Jquery效果集合，调用简单，转载或者修改请保存原有作者信息。
*/
;(function ($) {


   //焦点幻灯片
   CxcFocus=function(FocusNum){
       FocusNum=$.extend({
          Id:"",
          Time:5000
       },FocusNum);
       $("#"+FocusNum.Id).css("position","relative");
       $("#"+FocusNum.Id+" ul").attr("id","pic")
       var Li="#"+FocusNum.Id+" li";
       $(Li+":not(:first)").hide();
       var i=0;
       var len=$(Li).length;
       var LstUL ="<ul class='num'>";
       $(Li).each(function(NumI){
          var Numi=NumI+1;
          LstUL +="<li>"+Numi+"</li>";
       });
       LstUL +="</ul>";
       $("#"+FocusNum.Id).append(LstUL);
       $("#"+FocusNum.Id+" .num li:eq(0)").addClass("active");
       function Objstr(){
         var mo=(i+1)%len;
         $(Li+":eq("+i%len+")").fadeOut("slow",function(){
            $(Li+":eq("+mo+")").fadeIn("slow"); 
            $("#"+FocusNum.Id+" .num li").removeClass("active");
            $("#"+FocusNum.Id+" .num li:eq("+mo+")").addClass("active");
         });
         i++
       }
       var onload= setInterval(function(){Objstr()},FocusNum.Time)
       $("#"+FocusNum.Id+"").hover(function(){
          clearInterval(onload);
       },function(){
          onload=setInterval(function(){Objstr()},FocusNum.Time)
       });
       $("#"+FocusNum.Id+" .num li").click(function(){
          $("#pic li").hide();
          $(Li+":eq("+$(this).index()%len+")").fadeOut("slow",function(){
             $(Li+":eq("+$(this).index()+")").fadeIn("slow"); 
             $("#"+FocusNum.Id+" .num li").removeClass("active");
             $("#"+FocusNum.Id+" .num li:eq("+($(this).index())%len+")").addClass("active");
          });
          i=$(this).index();
       });
   }  
  
})(jQuery);


