//定义全局
instance = ''; //融云
userId   = ''; //用户ID, 当前用户
targetId = ''; //目标用户ID
conversationtype = RongIMLib.ConversationType.PRIVATE; //定义私有单聊

//取得URL参数数据
function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
        var r = window.location.search.substr(1).match(reg);  
        if (r != null) return unescape(r[2]);  
        return null;  
    }

/* -----------初始连接融云------------ */

function startInit(user,targetId){
    //取得用户TOKEN
    var userToken = '';

    $.ajax({
        url: window.__sealtalk_config.serverUrl + "/user/get_token",
        data: "token=" + getQueryString('token'),//取得URL上的TOKEN给服务端处理
        type: 'GET',
        dataType: 'json',
        success: function(data){
            if(data.code == 200){
                userToken = data.result.token;
            }else{
                console.log('获取TOKEN失败!');
            }
        },
        error: function(){
            console.log("请求失败");
        }
    }).then(function(){
        var params = {
            appKey : window.__sealtalk_config.appkey,
            token : userToken, //各用户专属TOKEN ，设置的一小时过期
            navi : ''
        };
        var callbacks = {
            //连接状态回调
            getInstance : function(instance){
                // RongIMLib.RongIMEmoji.init();

                //获取列表，待改为保存到本地设置一定过期时间
                instance.getConversationList({
                    onSuccess: function(list) {
                        console.log(list);
                        //取得列表，处理页面展示
                        var newDate = new Date();
                        for(storeId in list){
                            var storeInfo = list[storeId];
                            //验证状态
                            var active = '';
                            if(storeInfo.targetId == targetId){
                                active = 'class="active"';
                            }

                            newDate.setTime(storeInfo.latestMessage.sentTime);
                            var li='<li '+ active +' onclick="setTargetId(this,\'' + storeInfo.targetId + '\')">';
                                li+='<img class="logo" src="'+ storeInfo.latestMessage.content.user.portraitUri +'">';
                                li+= '<p class="title">'+ storeInfo.targetId +'</p>';
                                li+= '<p class="txtle">'+ storeInfo.latestMessage.content.content +'<span>0</span></p>';
                                li+= '<p class="time">'+ newDate.toLocaleDateString() +'</p></li>';
                            $('.socket-list ul').append(li);
                        }
                    },
                    onError: function(error) {
                        //列表获取失败时处理
                    }
                },null);

                //instance.sendMessage 可发送初始回复
            },
            getCurrentUser : function(userInfo){
                userId = userInfo.userId; //定义用户ID
                console.log(userInfo.userId);
                //连接成功初始处理
            },
            receiveNewMessage : function(message){
                //接收信息处理,暂时添加到聊天窗口
                var li="<li><span>" + message.content.content + "</span></li>";
                $('.socket-info ul').append(li);
            }
        };
        init(params,callbacks);
    });
}

/* --------以下部分为处理函数--------- */

//切换用户 根据URL数据 targetId
function setTargetInfo(){
    //测试数据
    targetId = getQueryString('storeID');
    console.log('set targetid success');
}
//切换用户 (侧边列表用户ID)
function setTargetId(obj,storeID){
    targetId = storeID;
    //测试直接先用刷新页面
    console.log(targetId);
    window.location.href = "http://chat.com/?token="+ userId +"&storeID=" + storeID;
    
    //处理对话框
}

//发送信息
function sendTextMessage(){
    /*
    1: 单条消息整体不得大于128K
    2: conversatinType 类型是 number，targetId 类型是 string
    */

    var content = {
        // content:"hello " + encodeURIComponent('π，α，β'),
        content: $('.socket-input .input').html(),
        user : {
            "userId" : userId,
            "name" : "张三",
            "portraitUri" : "http://rongcloud.cn/images/newVersion/log_wx.png"
        },
        extra:{
            "name":"name",
            "age" : 12
        }
    };

    var msg = new RongIMLib.TextMessage(content);

    var start = new Date().getTime();
    instance.sendMessage(conversationtype, targetId, msg, {
        onSuccess: function (message) {
            console.log("发送文字消息成功",message,start);
        },
        onError: function (errorCode,message) {
            console.log(errorCode);
            console.log("发送文字消息失败",message,start);
        }
    });
}

//获取历史消息
function getHistroyMessage(){
	/*
	注意事项：
		1：一定一定一定要先开通 历史消息云存储 功能，本服务收费，测试环境可免费开通
		2：timestrap第二次拉取必须为null才能实现循环拉取
	*/

	var count = 10;  // 2 <= count <= 20
	var timestrap = null; //0, 1483950413013

	var start = new Date().getTime();
	instance.getHistoryMessages(conversationtype, targetId, timestrap, count, {
		onSuccess: function(list, hasMsg) {
			//可通过sort订制其他顺序
			console.log(list.length);
			console.log(hasMsg);
			list.sort(function(a,b){
				return a.sentTime < b.sentTime;
			});

            showTips("获取历史消息成功");
            showResult("获取历史消息成功",list,start);
		},
		onError: function(error) {
            showTips("获取历史消息失败");
            showResult("获取历史消息失败",error,start);
		}
	});
}