function init(params,callbacks){
	var appKey = params.appKey;
	var token = params.token;
	var navi = params.navi || "";

	if(navi !== ""){
		//私有云
		var config = {
			navi : navi
		};
		console.log("私有云");
		console.log(params);
		RongIMLib.RongIMClient.init(appKey,null,config);
	}else{
		//公有云
		console.log("公有云");
		console.log(params);
		RongIMLib.RongIMClient.init(appKey);
	}

	instance = RongIMClient.getInstance();

	// 连接状态监听器
	RongIMClient.setConnectionStatusListener({
		onChanged: function (status) {
			console.log(status);
		    switch (status) {
		        case RongIMLib.ConnectionStatus.CONNECTED:
		            callbacks.getInstance && callbacks.getInstance(instance);
					break;
		        case RongIMLib.ConnectionStatus.CONNECTING:
		            console.log('正在链接');
		            break;
		        case RongIMLib.ConnectionStatus.DISCONNECTED:
		            console.log('断开连接');
		            break;
		        case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
		            console.log('其他设备登录');
		            break;
		          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
		            console.log('域名不正确');
		            break;
		        case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
		        	console.log('网络不可用');
		        	break;
		    }
		}
	});

	RongIMClient.setOnReceiveMessageListener({
		// 接收到的消息
		onReceived: function (message) {
		    // 判断消息类型
		    console.log("新消息: " + message.targetId);
            console.log(message);
            callbacks.receiveNewMessage && callbacks.receiveNewMessage(message);
		}
	});

	//开始链接
	RongIMClient.connect(token, {
		onSuccess: function(userId) {
			callbacks.getCurrentUser && callbacks.getCurrentUser({userId:userId});
			console.log("链接成功，用户id：" + userId);
		},
		onTokenIncorrect: function() {
			console.log('token无效');
			// 此处可添加重新获取
		},
		onError:function(errorCode){
		  console.log("=============================================");
		  console.log(errorCode);
		}
	});
}