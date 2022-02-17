
var Ie17173Passport = {
		logoutUrl:'',
		init : function(){
			var _this = this
			
			//绑定“登录”按钮
			$('.ie17173-login').bind('click',function(){
				_this.login($(this));
			})
			//绑定“登出”按钮
			$('.ie17173-logout').bind('click',function(){
				$(this).html('退出中...');
				_this.logout();
			})
			
			//登录成功后
			Passport.on(Passport.EVENTS.loginSuccess, function(){
				location.reload();
			});

			//登出成功后
			Passport.on(Passport.EVENTS.logoutSuccess, function(){
				if(_this.logoutUrl!=''){
					location.href = _this.logoutUrl;
				}else{
					location.reload();
				}
			});
			
		},
		
		login : function(btn){
			var _this = this;
			var _btn  = btn || false;
			if(_this.isCyouBrowser() && location.href.indexOf('ie17173.com/client/')>0){
				//call 浏览器登录
				alert('chrome://login');
				
			}else{
				//call web登录
				if(this.isLogin()){
					if(confirm('我们检查到您已登录，是否刷新当前页面')){
						location.reload();
					}
				}else{
					Passport.Dialog.show({
						//是否显示模态层,自定义ui时无效
						modal:true,
						//关闭登陆框时的回调函数,只会在本次关闭时调用一次.
						onHide:function(){
					    	if(Passport.isLoggedIn() && _btn){
					    		var url = _btn.attr('reload-url');
					    		if(url!=undefined && url != ''){
					    			location.href=url;
					    		}
					    	}
					    }
					});
				}
			}
		},
		
		logout : function(reload){
			var _this = this;
			Passport.logout(); // 注销
		},
		
		isLogin : function(){
			return Passport.isLoggedIn();
		},
		
		isCyouBrowser : function (){
			return navigator.userAgent.toLowerCase().indexOf('17173') > 0;
		}
}

function showLoginBox(){
	Ie17173Passport.login();
}

$(function(){Ie17173Passport.init()});

