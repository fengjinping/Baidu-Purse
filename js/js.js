//最外层是一个function，制作成为一个闭包，限制住变量作用域，不要去影响页面中的其他JS代码。
(function() {
    var nowpage = 0;        //信号量。当前显示的屏幕编号
    var lock = true;        //为了防止用户排名滚动滚轮设置的一个函数节流标识
    var footer = false;     //另一个信号量，表示当前footer是否是打开状态

    /*******************************************
    /* 添加鼠标滚动事件的监听
    /* mousewheel事件必须先引用jQuery.mousewheel.min.js插件
    /*这是鼠标滚动的页面最核心业务。
    /*******************************************/

    $(document).mousewheel(function (event, delta) {
        //delta的值： 滚轮下滚，屏幕上滚，-1； 滚轮上滚，屏幕下滚，1。
        if (lock) {
            //函数的节流，防止用户拼命滚动滚轮

            //【步骤1】判断是否到页面最底端，并且用户仍然向下滚动，那么就应该显示footer
            if (nowpage == 5 && delta == -1) {
                $(".footer").animate({"height": 458}, 500);   //动画显示footer
                $(".product-item:last").animate({"top": -458}, 500);
                footer = true;  //改变信号量的值，表示此时footer已经打开。
                return;     //****这里的return是非常关键的！不再让我们的程序继续往下运行。此处不影响信号量
            }
            //判断是否到页面最底端，并且用户向上滚动，那么就应该隐藏footer
            if (nowpage == 5 && delta == 1 && footer) {
                $(".footer").animate({"height": 0}, 500);   //动画显示footer
                $(".product-item:last").animate({"top": 0}, 500);
                footer = false;
                return;     //****这里的return是非常关键的！不再让我们的程序继续往下运行。此处不影响信号量
            }


            //【步骤2】改变信号量的值：
            nowpage = nowpage - delta;  //减去delta，所以滚轮下滚，信号量减去-1，所以信号量增大。

            //【步骤3】验收nowpage值是否合法，保证信号量只能是0、1、2、3、4、5
            if (nowpage < 0) {
                nowpage = 0;
            } else if (nowpage > 5) {
                nowpage = 5;
            }

            //【步骤4】根据用户是向上滚动还是向下滚动，来调用相应的换页面动画函数：
            if (delta == -1) {
                goDown();
            } else if (delta == 1) {
                goUp();
            }

            //【步骤5】小圆点的业务
            $(".xiaoyuandian ul li").eq(nowpage).addClass("cur").siblings().removeClass("cur");


            //【步骤6】函数节流
            lock = false;
            setTimeout(function () {
                lock = true;
            }, 600);
        }
    });

    /*******************************************
     /* 向下滚动页面的函数
     /*******************************************/
    function goDown() {
        //如果往下滚动，那么就要让新信号量的页面上来
        $(".product-item").eq(nowpage).animate({"top": "0%", "height": "100%"}, 500);
        //让产品图片和描述文字动画移入
        $(".product-item").eq(nowpage).find(".product-img").animate({"margin-top": -210}, 800);
        $(".product-item").eq(nowpage).find(".detail-wrap").animate({"margin-top": -100}, 800);

        //让导航条消失，淡出完毕之后，让类名加上，所以要写在回调函数里面。
        $(".hd").fadeOut(function () {
            $(".hd").addClass("white");
        });
    }

    /*******************************************
     /* 向上滚动页面的函数
     /*******************************************/
    function goUp() {
        //如果往上滚动，那么你就要让信号量加1的那个盒子，恢复到高度0，top100%。
        $(".product-item").eq(nowpage + 1).animate({"top": "100%", "height": "0%"}, 500);
        //让产品图片和描述文字动画移出
        $(".product-item").eq(nowpage + 1).find(".product-img").animate({"margin-top": -810}, 800);
        $(".product-item").eq(nowpage + 1).find(".detail-wrap").animate({"margin-top": -800}, 800);

        //决定导航条的样式
        if (nowpage == 0) {
            $(".hd").removeClass("white");
        }

        //让导航条出现
        $(".hd").fadeIn();
    }

    /*******************************************
    /*  首屏上面的切换图片，鼠标移入让类名为pic2，鼠标移出，让类名为pic1
    /*******************************************/
    $(".lightfocus").mouseenter(function () {
        $(this).children("div").removeClass("pic1").addClass("pic2");
    }).mouseleave(function () {
        $(this).children("div").removeClass("pic2").addClass("pic1");
    });


    /*******************************************
    /*  小圆点的事件监听
    /*******************************************/
    $(".xiaoyuandian ul li").click(function () {
        //如果用户点击的小圆点，要大于当前的页面编号
        if ($(this).index() > nowpage) {
            var cishu = $(this).index() - nowpage;
            //执行cishu次换屏幕的动画
            /*这里用for循环语句，由于for循环的非常快，所以我们必须用一个setTimeout把每次调用goDown()函数
             时间给错开，要不然看不出来层叠的刷刷刷的效果*/
            for (var i = 0; i < cishu; i++) {
                setTimeout(function () {
                    nowpage++;
                    goDown();
                    //小圆点的业务
                    $(".xiaoyuandian ul li").eq(nowpage).addClass("cur").siblings().removeClass("cur");
                }, 100 * i);
            }
        } else if ($(this).index() < nowpage) {
            //如果用户点击的小圆点，要小于当前的页面编号
            var cishu = nowpage - $(this).index();
            //执行cishu次换屏幕的动画
            /*这里用for循环语句，由于for循环的非常快，所以我们必须用一个setTimeout把每次调用goDown()函数
             时间给错开，要不然看不出来层叠的刷刷刷的效果*/
            for (var i = 0; i < cishu; i++) {
                setTimeout(function () {
                    nowpage--;
                    goUp();
                    //小圆点的业务
                    $(".xiaoyuandian ul li").eq(nowpage).addClass("cur").siblings().removeClass("cur");
                }, 100 * i);
            }
        }
    });

    //调整光束的位置
    rePosition();
    function rePosition(){
        $(".product0 .lightbox").css("margin-top",$(window).height() - 880);
    }
    $(window).resize(rePosition);
}());