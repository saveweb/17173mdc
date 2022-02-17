var bio = {
	//配置
	_on_load: false,//标记是否正在加载数据，防止同时多个加载触发，及无数据加载
	_on_append: true,//是否追加显示
	_ingress: '',
	_keyword: '',
	_page: 0,
	_page_total: 5,
	_timeout:'',
	//获取bio数据列表
	getPageList : function(){
		var _this = this;
		
		

		if(_this._on_load){
			return ;
		}
		
		_this._on_load = true;
		if(!bio._on_append){
			$('.bio-list').html('');
		}
		
		$('.loading-more').show();
		$.ajax({
			url : 'ajaxGetPageList',
			data : {ingress: _this._ingress, page: _this._page, page_total: _this._page_total},
			dataType : 'json',
			type : 'post',
			success : function(r){		
				if(r.success){
					var html = '';
					if(r.total > 0){
						if(r.list.length > 0){
							$.each(r.list, function(i){
								var quality = this.b_quality;
								if (quality == 1) {
									var card = 'bio-card4';
								} else if (quality == 2) {
									var card = 'bio-card3';
								} else if (quality == 3) {
									var card = 'bio-card1';
								} else if (quality == 4) {
									var card = 'bio-card2';
								}
							
								html += '<li><a onclick="javascript:return false;"><div class="bio-img ' +card+'"><div class="img">';
								html += '<img src='+this.b_positive_img+' alt=""/><div class="cover"></div><span class="h">AGENT</span>';
								html += '<span class="b">'+this.b_name+'</span></div>';
								html += '<div class="img1">';
								html += '<img src='+this.b_reverse_img+' alt=""/><div class="cover"></div><span class="h">AGENT</span>';
								html += '<span class="b">'+this.b_name+'</span></div></div></a></li>';
							});
							$(html).hide().appendTo('.wall ul').fadeIn("slow");
							_this._page++;
							_this._on_load = false;
						} else {
							_this._on_load = true;
						}	
					}else{
						html += '<div class="empty"><span class="icon-warn"></span>抱歉！暂无数据</div>';
						$('.wall ul').html(html);
					}
					$('.loading-more').hide();	
				}
			},
			error : function(){
			}
			
		});
	},
	//滚动翻页
	scrollPage : function (event) {
		var _this = bio;
    	//网页的高度,这个最大
    	var textheight = $(document).height();
        //滚动条到网页头部的 高度，兼容ie,ff,chrome，小于等于网页的高度+可见区$(window).height()的高度
    	var top = document.documentElement.scrollTop + document.body.scrollTop; 
        // 网页高度-top-当前窗口高度 
    	var pre_load_height = -300;
       
    	if (_this._on_load==false && top + $(window).height() > textheight + pre_load_height) {
    		//延迟发送请求
    		$('.loading-more').show();
    		clearTimeout(_this._timeout);
    		_this._timeout = setTimeout('bio.getPageList();',500);
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
	}
};