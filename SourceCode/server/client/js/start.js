        //
        instance = ''; //融云
        userId   = ''; //用户ID, 当前用户
        targetId = ''; //目标用户ID

        //取得URL参数数据 
        function getQueryString(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
                var r = window.location.search.substr(1).match(reg);  
                if (r != null) return unescape(r[2]);  
                return null;  
            }
        
        function startInit(user,targetId){
            //取得用户TOKEN
            var userToken = '';

            //测试用
            setTargetInfo();

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
                    token : userToken,
                    navi : ''
                };
                var callbacks = {
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
                                    newDate.setTime(storeInfo.latestMessage.sentTime);
                                    var li='<li><img class="logo" src="'+ storeInfo.latestMessage.content.user.portraitUri +'">';
                                        li+= '<p class="title">'+ storeInfo.targetId +'</p>';
                                        li+= '<p class="txtle">'+ storeInfo.latestMessage.content.content +'<span>0</span></p>';
                                        li+= '<p class="time">'+ newDate.toLocaleDateString() +'</p></li>';
                                    $('.socket-list ul').append(li);
                                }
                            },
                            onError: function(error) {
                                //列表获取失败应该处理什么？
                            }
                        },null);

                        //instance.sendMessage
                    },
                    getCurrentUser : function(userInfo){
                        userId = userInfo.userId;
                        console.log(userInfo.userId);
                        alert("链接成功；userid=" + userInfo.userId);
                        //连接成功初始处理
                    },
                    receiveNewMessage : function(message){
                        //接收信息处理
                        var li="<li><span>"+message.content.content+"</span></li>";
                        $('.socket-info ul').append(li);
                    }
                };
                init(params,callbacks);
            });
        }

        //切换用户时修改目标信息。 targetId
        function setTargetInfo(){
            //测试数据
            targetId = getQueryString('storeID');
        }

        //发送信息
        function sendTextMessage(){
            /*
            1: 单条消息整体不得大于128K
            2: conversatinType 类型是 number，targetId 类型是 string
            */
            var conversationtype = RongIMLib.ConversationType.PRIVATE;

            //测试用
            setTargetInfo();

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