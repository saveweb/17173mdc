var onSend = false;//判断是否在发送
$(document).ready(function(){
	$('.link-favorites').bind('click',function(){
		if(onSend){
			return ;
		}
		onSend = true;
		var attentiontype = 1;
		if($(this).hasClass('cur')){
			attentiontype = 2;
		}
		$.ajax({
			url : '/attention/ajaxUpdateUserAttention',
			data : {
				type: 1,
				typeid: a_id,
				attentiontype: attentiontype
			},
			dataType : 'json',
			type : 'post',
			success : function(rs){
				if(rs.needlogin){
					showLoginBox();
				}
				if(rs.success){
					var fav_num = $('#favorites-num').html();
					if(rs.attentiontype == 1){
						message.success('收藏成功！');
						$('.link-favorites').addClass('cur');
						fav_num++;
						$('#favorites-num').html(fav_num);
					}else{
						message.success('取消成功！');
						$('.link-favorites').removeClass('cur');
						fav_num--;
						$('#favorites-num').html(fav_num);
					}
				}
				onSend = false;
			}
		});
	});
	
	//判断是否收藏
	$.ajax({
		url : '/attention/ajaxCheckUserAttention',
		data : {
			type: 1,
			typeid: a_id
		},
		dataType : 'json',
		type : 'post',
		success : function(rs){
			if(rs.success){
				if(rs.result){
					$('.link-favorites').addClass('cur');
				}
			}
		}
	});
});