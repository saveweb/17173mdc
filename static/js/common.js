$(function($) {
	$('.p-msg-t li').bind('click',function(){
		$('.p-msg-t li').removeClass('cur');
		$(this).addClass('cur');
		if($(this).hasClass('commentBtn')){
			msg.getMsgData('comment');
			$('.p-msg-c ul').parent().attr('class','p-msg-list1');
		}
		if($(this).hasClass('messageBtn')){
			msg.getMsgData('default');
			$('.p-msg-c ul').parent().attr('class','p-msg-notice');
		}
	});
	msg.getNewCount();
});

//资料认证引导弹窗
function showAuthBox(){
	$('.pop-cover, .pop3').show();
	$('.pop3 .close').bind('click', function(){
		$('.pop-cover, .pop3').hide();
    });
}

function getByteLen(val) {    //传入一个字符串
	var len = 0;
	for (var i = 0; i < val.length; i++) {
		if (val[i].match(/[^\x00-\xff]/ig) != null) //全角 
	        len += 2; //如果是全角，占用两个字节
	    else
	        len += 1; //半角占用一个字节
    }
    return len;
}
var message = {
	option:{
        appendTo: "body",
        customClass: 'class-or-false',
        type: "info",
        offset:{from: "top",amount: '50%'},
        align: "center",
        minWidth: 250,
        maxWidth: 450,
        delay: 3000,
        allowDismiss: false,
        spacing: 10
    },
	success:function(msg,url){
    	this.option.delay = 1000;
    	this.option.allowDismiss = false;
    	$.simplyToast(msg, 'success', this.option);
    	var url = url || '';
    	if(url!=''){
    		setTimeout('location.href="'+url+'";', this.option.delay+500);
    	}
	},
	warning:function(msg,url){
		this.option.allowDismiss = true;
		$.simplyToast(msg, 'success', this.option);
		var url = url || '';
		if(url!=''){
    		setTimeout('location.href="'+url+'";', this.option.delay+500);
    	}
	}
};
//通知JS对象
var msg = {
	//轮询临时对象
	nt:0,
	//获取未读通知数量
	getNewCount:function(){
		if($('.msg-tips').length>0){
			$.getJSON(SITE_URL+"message/ajaxNewCount?callback=?", function(json){
				if(json.success){
					if(json.default_count>0){
						$('.messageBtn .count').html(json.default_count).show();
					}else{
						$('.messageBtn .count').hide();
					}
					
					if(json.comment_count>0){
						$('.commentBtn .count').html(json.comment_count).show();
					}else{
						$('.commentBtn .count').hide();
					}
					
					if($('.p-msg-t .cur').hasClass('messageBtn')){
						msg.getMsgData('default');
					}else if($('.p-msg-t .cur').hasClass('commentBtn')){
						msg.getMsgData('comment');
					}
					
					if( json.default_count < 1 && json.comment_count < 1 ){
						$('.msg-news').hide();
					}else{
						$('.msg-news').show();
					}
				}
				clearTimeout(msg.nt);
				msg.nt = setTimeout('msg.getNewCount();',1000*60);//1分钟刷新一次
			});
		}
	},
	//获取通知数据
	getMsgData:function(toConf){
		if($('.msg-tips').length>0){
			//通知
			$.getJSON(SITE_URL+"message/ajaxGetDataList?callback=?",{toConf:toConf}, function(json){
				var html = '';
				if(json.success){
					$(json.list).each(function(){
						if(toConf == 'comment'){
							html+='<li data-id="'+this.id+'" data-toConf="comment" data-status="'+this.status+'">'+(this.status==0?'<span class="icon-new"></span>':'')+this.content+'</li>'
						}else{
							html+='<li data-id="'+this.id+'" data-toConf="default" data-status="'+this.status+'">'+(this.status==0?'<span class="icon-new"></span>':'')+'<p>'+this.content+'</p><div class="h clearfix"><span class="date">'+this.showtime+'</span></div></li>'
						}
					});
				}
				$('.msg-tips .p-msg-c ul').html(html==''?'<li>&nbsp;</li>':html);
				if(toConf == 'comment'){
					$('.p-msg-list1').getNiceScroll().resize();
				}else{
					$('.p-msg-notice').getNiceScroll().resize();
				}
			});
			//点击查看
			$('.msg-tips .p-msg-c li').live('click',function(){
				var id     = $(this).attr('data-id');
				var toConf = $(this).attr('data-toConf');
				var status = $(this).attr('data-status');
				if(status=='0'){
					$(this).find('.icon-new').remove();
					$.getJSON(SITE_URL+"message/ajaxLook?callback=?",{id:id,toConf:toConf}, function(json){
						if(json.success){
							msg.getNewCount();
						}
					});
				}
			});
		}
	}
};
//js alert
$(function(){
	$('.layer').click(function(){
		if($('.pop-addr').length == 0) {
			$.get("/article/layer", function(html){
				$('body').append(html);
			});
		} else {
			$('.pop-form').show();	
		}
	})
});
