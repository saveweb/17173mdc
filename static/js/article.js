var article = {
	//配置
	_on_load: false,//标记是否正在加载数据，防止同时多个加载触发，及无数据加载
	_on_append: true,//是否追加显示
	_city: '',
	_cid: 0,
	_keyword: '',
	_page: 0,
	_page_total: 10,
	_timeout:'',
	//获取文章数据列表
	getPageList : function(){
		var _this = this;
		
		if(_this._on_load){
			return ;
		}
		
		_this._on_load = true;
		if(!article._on_append){
			$('.news-list').html('');
		}
		$('#article_loading').show();
		
		$.ajax({
			url : SITE_URL+`menus/${_this._city}_${_this._page}.json`,
			dataType : 'json',
			type : 'get',
			success : function(r){
				if(r.success){
					//录像列表
					var html = '';
					if(r.total > 0){
						if(r.list){
							$.each(r.list, function(i){
								html += '<li class="clearfix">';
								html += '<div class="img">';
								html += '<a target="_blank" href="'+this.url+'" title="'+this.title+'">';
								html += '<img src="'+this.logo+'" width="204" height="143" alt=""/>';
								html += '</a>';
								html += '<span class="note">'+this.column+'</span>';
								html += '</div>';
								html += '<div class="text">';
								html += '<div class="h">';
								html += '<a target="_blank" href="'+this.url+'" title="'+this.title+'">'+this.title+'</a>';
								html += '</div>';
								html += '<p class="p" title="'+this.summary+'">'+this.summary+'</p>';
								html += '<div class="info clearfix">';
								html += '<div class="date">';
								if(this.source==1){
									html += '<span>'+this.article_level+'：</span>';
//									html += '<img src="'+this.adduser.face+'" alt=""/>';
									html += '<a class="user" href="'+this.adduser.url+'">'+this.adduser.nickname+'</a>';
								}else{
									html += '<span>转载自：</span>';
									html += '<a class="user" href="javascript:void(0);">'+this.source_info+'</a>';
								}
								html += '<span>'+this.addtime+'</span>';
								html += '</div>';
								html += '<div class="op">';
								html += '<a href="'+this.url+'#link-comment" target="_blank"><span class="num"></span><span>'+this.comment+'</span></a>';
								html += '</div>';
								html += '</div>';
								html += '</div>';
								html += '</li>';
							});
							$(html).hide().appendTo('.news-list').fadeIn("slow");
							_this._page++;
							_this._on_load = false;
							//当页数超过5页时关闭滚动翻页功能并开启手动翻页模块
							if(_this._page>=0 || !article._on_append){
								article._on_append = false;
								$(window).unbind("scroll");
								$('#article_loading').hide();
								$('#article_page').html(r.pagination).show();
							}
						}
					}else{
						html += '<div class="empty"><span class="icon-warn"></span>抱歉！暂无文章</div>';
						$('.news-list').html(html);
					}
					$('#article_loading').hide();
				}
			},
			error : function(){
			}
			
		});
	},
	//滚动翻页
	scrollPage : function (event) {
		var _this = article;
    	//网页的高度,这个最大
    	var textheight = $(document).height();
        //滚动条到网页头部的 高度，兼容ie,ff,chrome，小于等于网页的高度+可见区$(window).height()的高度
    	var top = document.documentElement.scrollTop + document.body.scrollTop; 
        // 网页高度-top-当前窗口高度 
    	var pre_load_height = -300;
       
    	if (_this._on_load==false && top + $(window).height() > textheight + pre_load_height) {
    		//延迟发送请求
    		$('#article_loading').show();
    		clearTimeout(_this._timeout);
    		_this._timeout = setTimeout('article.getPageList();',500);
        }
    },
	//初始化
	init : function(){
		var _this = this;
		//强制将轮动条置顶，防止有些浏览器会记忆上次滚动条位置，导致不停加载图片
		$(window).scrollTop(0);
		
		//绑定滚动条事件
	    $(window).bind("scroll",_this.scrollPage);
	    
	    //加载数据
		_this.getPageList();
		
		//资讯栏目绑定点击事件
		$('.article-column a').bind('click',function(){
			$('.article-column a').removeClass('cur');
			$(this).addClass('cur');
			_this._cid = $(this).attr('data');
			_this._keyword = '';
			_this._page = 0;
			_this._on_load = false;
			_this._on_append = true;
			$('.news-list').html('');//数据清空重新加载
			$('#article_page').hide();
			$(window).bind("scroll",_this.scrollPage);
			_this.getPageList();
		});
	}
};