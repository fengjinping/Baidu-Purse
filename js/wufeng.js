function wufeng(zhouqishijian){
	//计算机自动来计算折返点
	var zongkuandu = 0;
	$(".wufeng .huoche li").each(
		function(){
			zongkuandu = zongkuandu + $(this).outerWidth(true);
		}
	);

	//克隆所有的li
	$(".wufeng .huoche li").clone().appendTo(".wufeng .huoche");

	dongyici(zhouqishijian); //调用函数

	//动一次的函数:
	function dongyici(shijian){
		$(".wufeng .huoche").stop().animate({"left":-zongkuandu},shijian,"linear",function(){
			$(".wufeng .huoche").css("left",0);
			dongyici(zhouqishijian);
		});
	}

	//鼠标进入，动画停止
	$(".wufeng").mouseenter(
		function(){
			$(".wufeng .huoche").stop();
		}
	);

	//鼠标离开，动画继续
	$(".wufeng").mouseleave(
		function(){
			var yijingzouguo = parseInt($(".wufeng .huoche").css("left")); //已经走过的路程
			var shengyushijian = zhouqishijian * ( 1 +  yijingzouguo / zongkuandu); //剩余时间
			dongyici(shengyushijian);
		}
	);
}