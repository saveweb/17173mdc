$(function() {
    $('.js-drop').bind('mouseenter', function () {
        $(this).addClass('drop-hover');
        if ($(this).parent().hasClass('nav')) {
            $(this).find('.drop').stop(true, true).css({display: 'block'}).animate({opacity: 1, top: '40px'}, 200);
        } else {
            $(this).find('.drop').stop(true, true).css({display: 'block'}).animate({opacity: 1}, 200);
        }
    }).bind('mouseleave', function () {
        $(this).removeClass('drop-hover');
        if ($(this).parent().hasClass('nav')) {
            $(this).find('.drop').stop(true, true).animate({opacity: 0, top: '48px'}, 100, function () {
                $(this).css({display: 'none'});
            });
        } else {
            $(this).find('.drop').stop(true, true).animate({opacity: 0}, 100, function () {
                $(this).css({display: 'none'});
            });
        }
    });

    var $backTop = $('.back-top');
    if ($backTop.length > 0) {
        var bPos = function (top) {
            if (!$.browser.msie && ($.browser.version != "6.0") && $.support.style) { //非ie6
                if (top > 10) {
                    $backTop.stop().css({display: 'block'}).animate({opacity: 1}, 100);
                } else if (top <= 10) {
                    $backTop.stop().animate({opacity: 0}, 100, function () {
                        $(this).css({display: 'none'})
                    });
                }
            }
        };
        $(window).bind('scroll', function () {
            bPos($(document).scrollTop());
        });
        $backTop.live('click', function () {
            $("html, body").animate({ scrollTop: 0 }, 300);
        });
    }

    var $flash = $('.flash');
    if ($flash.length > 0) {
        $flash.alFadeslider();
    }

    $('.js-buy').bind('click', function(){
        $('.pop-pay').fadeIn(100);
    });
    $('.pop-pay-close').bind('click', function(){
        $('.pop-pay').fadeOut(100);
    });

    //收藏
    $(".js-fav").click(function(){
        var title = document.title;
        var url = location.href;
        var ctrl=(navigator.userAgent.toLowerCase()).indexOf('mac')!=-1?'Command/Cmd': 'CTRL';
        if(document.all){
            window.external.AddFavorite(url, title);
        }
        else if(window.sidebar){
            window.sidebar.addPanel(title, url, "");
        }
        else{ alert('您可以通过快捷键' + ctrl + ' + D 加入到收藏夹');}
        return false;
    })

    /*share*/
    var shareInit = {
        appkey : '',
        url : encodeURIComponent(document.location.href),
        source : encodeURIComponent('游事儿'),
        sourceUrl : '',
        title : encodeURIComponent(document.title),
        pic : [],
        summary : '',
        desc : ''
    };
    var shareLink = {
        qq : '"http://connect.qq.com/widget/shareqq/index.html?&appkey=aabc356f13fc4fbea85e8d59f7cd9dd1&url='+ shareInit.url +'&title='+ shareInit.title +'&desc='+ shareInit.desc +'&summary='+ shareInit.summary +'&pics='+ shareInit.pic.join('|') +'&site='+ shareInit.source + '" target="_blank" class="share-qq"',
        weixin : 'http://s.jiathis.com/qrcode.php?url=' + shareInit.url,
        sina : '"http://v.t.sina.com.cn/share/share.php?appkey=2038131490&url='+ shareInit.url +'&title='+ shareInit.title +'&ralateUid=&source='+ shareInit.source +'&content=utf8&pic='+ shareInit.pic.join('||') +'" target="_blank" class="share-sina" title="'+ shareInit.title +'"',
        qzone : '"http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+ shareInit.url +'&title='+ shareInit.title +'&pics='+ shareInit.pic.join('|') + '"'
    };
    $('.js-sina').attr('href', 'http://v.t.sina.com.cn/share/share.php?appkey=2038131490&url='+ shareInit.url +'&title='+ shareInit.title +'&ralateUid=&source='+ shareInit.source +'&content=utf8&pic='+ shareInit.pic.join('||'));
    $('.js-wei').live('mouseenter', function(){
        $(this).find('img').stop(true, true).fadeIn(200);
    }).live('mouseleave', function(){
        $(this).find('img').stop(true, true).hide();
    }).find('img').attr('src', shareLink.weixin);
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
            if(length == 1){
                $title.hide();
            }
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
