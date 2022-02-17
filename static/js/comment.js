$(document).ready(function(){
	comment.search('link-comment',a_id,0,1);
	comment.search('link-comment',a_id,1,1);
	/*
	$('.article-share .link-comment').live('click', function(){
		if ($('#quick-comment').is(':hidden')) {
			$('#quick-comment').show();
			comment.search('quick-comment',a_id,0,1);
			comment.search('quick-comment',a_id,1,1);
		} else {
			$('#quick-comment').hide();
		}
	});
	$('#quick-comment .close').live('click', function(){
		$('#quick-comment').hide();
	});
	*/
	$('.comment-bar .comment-note').live('click', function(){
		var cu_cid = $(this).parent().parent().attr("c_id");
		if (comment_up.send > 0) {
			comment_up.submit(cu_cid,$(this));
		}
	});
	$('.comment-bar .comment-msg').live('click', function(){
		if ($(this).parent().next().length == 0) {
			$(this).parent().after('<div class="comment-reply1 clearfix"><div class="clearfix"><div class="img"></div><input class="comment-reply-input" type="text"/></div><div class="comment-reply-bar clearfix"><div class="comment-reply-button"><span><label for=""><input type="checkbox"/>匿名跟帖</label></span></div><a class="js-send" href="javascript:;">发表</a></div></div>');
		} else {
			$(this).parent().next().remove();
		}
	});
	$('.comment-reply .js-send').live('click', function(){
		var c_aid = a_id;
		var c_cid_quoted = 0;
		var c_reply = $(this).parent().parent().find('textarea').val();
		var c_anonymous = $(this).parent().parent().find(':input[type="checkbox"]').is(':checked');
		if (comment.send > 0) {
			comment.submit(c_aid,c_cid_quoted,c_reply,c_anonymous,$(this));
		}
	});
	$('.comment-reply1 .js-send').live('click', function(){
		var c_aid = a_id;
		var c_cid_quoted = $(this).parent().parent().parent().attr("c_id");
		var c_reply = $(this).parent().parent().find(':input[type="text"]').val();
		var c_anonymous = $(this).parent().parent().find(':input[type="checkbox"]').is(':checked');
		if (comment.send > 0) {
			comment.submit(c_aid,c_cid_quoted,c_reply,c_anonymous,$(this));
		}
	});
});
var comment = {
	send:1, //是否可发送
	num:{0:0,1:0},
	search:function(c_position,c_aid,c_vip,page){
		$.ajax({
			url : '/comment/ajaxgetlist',
			data : {c_position:c_position,c_aid:c_aid,c_vip:c_vip,page:page},
			dataType : 'json',
			type : 'get',
			success : function(json){
				if(json.success){
					if(json.data){
						if (json.data.list.length > 0) {
							var bodyStr = '';
							bodyStr += '<ul>';
							$(json.data.list).each(function(){
								bodyStr += '<li class="clearfix" c_id="'+this.c_id+'">';
								bodyStr += '<div class="comment-date clearfix">';
								bodyStr += '<div class="comment-user">';
								bodyStr += '<div class="img"><img src="'+this.c_user.face+'" alt=""/></div>';
								bodyStr += '<p><a href="javascript:;">'+this.c_user.nickname+'</a> <!--<span class="comment-icon-v"></span></p>-->';
								bodyStr += '</div>';
								bodyStr += '<code">'+this.c_replytime+' 发表</code>';
								bodyStr += '</div>';
								if (typeof this.c_comment_quoted != 'undefined') {
									bodyStr += comment.build(0,this.c_comment_quoted);
								}
								bodyStr += '<div class="comment-body">'+this.c_reply+'</div>';
								bodyStr += '<div class="comment-bar">';
								bodyStr += '<a class="comment-note'+(this.c_up>0?' cur':'')+'" href="javascript:;">'+this.c_ups+'</a><a class="comment-msg" href="javascript:;"></a>';
								bodyStr += '</div>';
								bodyStr += '</li>';
							});
							bodyStr += '</ul>';

							//评论数和参与数
							comment.num[c_vip] = json.data.total;
							$('.page-data .js-comment-num').html(comment.num[0]+comment.num[1]);
							$('#'+c_position+' .js-comment-num').html(comment.num[0]+comment.num[1]);

							//评论列表
							$('#'+c_position+' .js-comment-list-'+c_vip).html(bodyStr+json.data.pagination);

							//名人评论
							if (c_vip == 1) {
								$('#'+c_position+' .js-comment-title-'+c_vip).show();
								$('#'+c_position+' .js-comment-list-'+c_vip).show();
							}
						} else {
							//评论列表
							$('#'+c_position+' .js-comment-list-'+c_vip).html('<div class="empty"><span class="icon-warn"></span>还没有人评论过，赶紧来抢沙发吧！</div>');

							//名人评论
							if (c_vip == 1) {
								$('#'+c_position+' .js-comment-title-'+c_vip).hide();
								$('#'+c_position+' .js-comment-list-'+c_vip).hide();
							}
						}
					}
				}
			}
		});
	},
	submit:function(c_aid,c_cid_quoted,c_reply,c_anonymous,event){
		c_anonymous = Number(c_anonymous);
		if (comment.send == 0) {
			return false;
		}
		comment.send = 0;
		$.ajax({
			url : '/comment/ajaxsubmit',
			data : {c_aid:c_aid,c_cid_quoted:c_cid_quoted,c_reply:c_reply,c_anonymous:c_anonymous},
			dataType : 'json',
			type : 'post',
			success : function(json){
				if(json.success){
					message.success(json.msg);
					$(event).closest('.comment-reply-box').find('textarea').val('');
					comment.search($(event).closest('.comment').attr("id"),a_id,0,1);
					comment.search($(event).closest('.comment').attr("id"),a_id,1,1);
				} else {
					if (json.errno == -102) {
						showLoginBox();
					} else {
						message.warning(json.msg);
					}
				}

				//再次发送
				comment.send = 1;
			}
		});
	},
	build:function(index,c_comment_quoted){
		var buildStr = '';
		if (c_comment_quoted[index]) {
			buildStr += '<div class="comment-build'+(index==0?' comment-build-basic':'')+'">';
			buildStr += comment.build(index+1,c_comment_quoted);
			buildStr += '<div class="comment-build-t clearfix">';
            buildStr += '<a href="javascript:;">'+c_comment_quoted[index]['c_user']['nickname']+'</a><code>'+(c_comment_quoted.length-index)+'</code>';
            buildStr += '</div>';
            buildStr += '<p>'+c_comment_quoted[index]['c_reply']+'</p>';
            //buildStr += '<div class="comment-bar">';
			//buildStr += '<a class="comment-note" href="">12</a><a class="comment-msg" href="">12</a>';
            //buildStr += '</div>';
            buildStr += '</div>';
		}

		return buildStr;
	}
};
var comment_up = {
	send:1, //是否可发送
	submit:function(cu_cid,event){
		if (comment_up.send == 0) {
			return false;
		}
		comment_up.send = 0;
		$.ajax({
			url : '/comment_up/ajaxsubmit',
			data : {cu_cid:cu_cid},
			dataType : 'json',
			type : 'post',
			success : function(json){
				if(json.success){
					message.success(json.msg);
					$(event).addClass('cur');
					$(event).html(Number($(event).html())+1);
				} else {
					//message.warning(json.msg);
				}

				//再次发送
				comment_up.send = 1;
			}
		});
	}
};
