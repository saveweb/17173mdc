$(function(){
    $('.input-text').bind('focus', function(){
        if($(this).val() == $(this).attr('data')){
            $(this).val('');
        }
        $(this).addClass('focus');
    }).bind('blur', function(){
        if($(this).val() == ''){
            $(this).val($(this).attr('data'));
        }
        $(this).removeClass('focus');
    });
});
(function($){
    $.fn.alFadeslider = function(setting){
        //参数设置
        defaults = {
            //box:'#alFade',			//容器DIV
            pic:'.origin',		//图片DIV
            title:'.thumb',	//标题DIV
            mouseType:'click',		//鼠标控制方式
            on:'cur',			//选中标签的类
            flag:0,					//默认第一个显示的内容，一般不做修改
            isAuto:true,			//是否自动播放
            timeScroll:3000			//轮播时间 - 秒
        };
        setting = $.extend({},defaults,setting);
        return this.each(function(){
            //变量初始化
            var $box = $(this);
            var $pic = $box.children(setting.pic);
            var $title = $box.children(setting.title);
            var $picLi = $pic.children('li');
            var $titleLi = $title.children('li');
            var length = ($picLi.length > $titleLi.length) ? $titleLi.length : $picLi.length;
            var current = setting.on || 'cur';
            var time = '';
            var flag = setting.flag;
            //基本动画
            var ani = function(x){
                $picLi.stop(true, true).eq(x).fadeIn(600).siblings().fadeOut(600);
                $titleLi.eq(x).addClass(current).siblings().removeClass(current);
            };
            //鼠标事件绑定
            $titleLi.each(function(i,j){
                $(j).bind(setting.mouseType,function(){
                    flag = i;
                    ani(flag);
                });
            });
            ani(flag);
            flag++;
            if(flag == length){ flag = 0; }
            //自动播放
            var play = function(){
                time = setTimeout(function(){
                    ani(flag);
                    flag++;
                    if(flag == length){ flag = 0; }
                    play();
                }, setting.timeScroll);
            };
            //是否执行自动播放
            if(setting.isAuto){
                clearTimeout(time);
                play();
                //鼠标悬停
                $box.hover(function(){
                    clearTimeout(time);
                },function(){
                    /*flag++;
                     if(flag == length){ flag = 0; }*/
                    play();
                });
            }else{
                ani(setting.flag);
            }
        });
    };
})(jQuery);
//stepScroll
(function($){
    $.fn.alstepscroll = function(setting){
        var defaults = {
            box	:	'ul',	//box
            items	:	'li',	//scroll item
            pre	:	'.pre',	//left scroll
            next	:	'.next',	//right scroll
            isLoop:	true,	//是否自动滚动
            visible:	5,		//一排可见元素数量
            stime	:	4000,	//twice scroll separate time
            atime	:	500	//scroll animate time
        };
        setting = $.extend({}, defaults, setting);
        return this.each(function(){
            var $this = $(this),
                $box = $this.find(setting.box),
                $item = $this.find(setting.items),
                $pre = $this.find(setting.pre),
                $next = $this.find(setting.next),
                visible = setting.visible || 5,
                isAni = false,
                isStop = false;
            //init
            var single = $item.eq(0).outerWidth(true),
                flag = 1,
                length = $item.length,
                pages = Math.ceil(length / visible);
            if(setting.visible >= length) {
                $pre.hide();
                $next.hide();
                return;
            }
            //补全
            if ((length % visible) != 0) {
                var loop = 0;
                var str = '';
                for(loop=0; loop<visible-length%visible; loop++){
                    str += '<li class="empty"></li>';
                }
                $box.append(str);
            }
            //clone
            $item = $this.find(setting.items); // reselect
            $item.filter(':first').before($item.slice(- visible).clone().addClass('cloned'));
            $item.filter(':last').after($item.slice(0, visible).clone().addClass('cloned'));
            $box.css({left:'-'+flag*visible*single+'px'});
            //goto page
            isAni = true;
            function play(dir){
                flag = dir==1 ? flag-1 : flag+1;
                $box.animate({left:'-'+flag*visible*single+'px'},setting.atime,function(){
                    if(flag > pages){
                        flag = 1;
                        $(this).css({left:'-'+visible*single+'px'});
                    }else if(flag == 0){
                        flag = pages;
                        $(this).css({left:'-'+visible*pages*single+'px'});
                    }
                    isAni = true;
                });
            }
            //loop
            var timerPlay = setInterval(function(){
                if(isStop){
                    return;
                }else{
                    play();
                }
            },setting.stime);
            //isLoop
            if(!setting.isLoop){
                clearInterval(timerPlay);
            }
            //hover
            $this.hover(function(){
                isStop = true;
            },function(){
                isStop = false;
            });
            //btn function
            $pre.bind('click',function(){
                if(isAni){
                    isAni = false;
                    play(1);
                }
                return false;
            });
            $next.bind('click',function(){
                if(isAni){
                    isAni = false;
                    play();
                }
                return false;
            });
        });
    }
})(jQuery);