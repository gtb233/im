var APIResult, Blacklist, Cache, Config, DataVersion, Friendship, Group, GroupMember, GroupSync, LoginLog, MAX_GROUP_MEMBER_COUNT,
 NICKNAME_MAX_LENGTH, NICKNAME_MIN_LENGTH, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PORTRAIT_URI_MAX_LENGTH, PORTRAIT_URI_MIN_LENGTH,
  Session, User, Utility, VerificationCode, _, co, express, getToken, moment, qiniu, ref, regionMap, rongCloud, router, sequelize, validator;

express = require('express');

//数据处理
//_ = require('underscore');
//日期处理库
// moment = require('moment');
//融云
rongCloud = require('rongcloud-sdk');
//七牛
// qiniu = require('qiniu');

Config = require('../conf');

Cache = require('../util/cache');

Session = require('../util/session');

Utility = require('../util/util').Utility;

APIResult = require('../util/util').APIResult;

//初始化融云SDK
rongCloud.init(Config.RONGCLOUD_APP_KEY, Config.RONGCLOUD_APP_SECRET);

router = express.Router();

getToken = function(userId, nickname, portraitUri) {
  return new Promise(function(resolve, reject) {
    return rongCloud.user.getToken(userId, nickname, portraitUri, function(err, resultText) {
      var result;
      if (err) {
        returnsreject(err);
      }
      result = JSON.parse(resultText);
      if (result.code !== 200) {
        return reject(new Error('RongCloud Server API Error Code: ' + result.code));
      }
      //保存TOKEN到本地或数据库

      //输出TOKEN
      return resolve(result.token);
    });
  });
};

//测试数据gw00001
var user = {id: "GW78829820", nickname:"nickname", portraitUri: "http://img5.imgtn.bdimg.com/it/u=3281768044,2052582677&fm=26&gp=0.jpg"};

//验证用户
router.get('/login', function(req, res, next) {
    //根据商城用户TOKEN与商家ID 获取用户信息（必需）与商家信息（可无）
});

//取得TOKEN数据 （融云直接） 暂时GET
router.get('/get_token', function(req, res, next) {
    var prefix = 'usertoken_'; //前缀
    var reqToken = req.query.token;
    var token = '';
    if(Utility.isEmpty(reqToken) || reqToken == 'null'){
      return res.send(new APIResult(500, '数据丢失!'));
    }
    var cacheKey = prefix + reqToken;
    
    //从本地获取TOKEN
    // token = Session.getUserTokenCookie(req);
    Cache.get(cacheKey).then(function(cacheToken){
      token = cacheToken;
    }).then(function(){
        if (Utility.isEmpty(token)){
              //若过期或不存在则重新请求
              getToken(user.id, user.nickname, user.portraitUri).then(function(newToken) {
                  // Session.setUserTokenCookie(res, newToken);
                  Cache.set(cacheKey, newToken);
                  token = newToken;
                }).then(function(){
                  return res.send(new APIResult(200, Utility.encodeResults({
                    userId: user.id,
                    token: token
                  })));
                });
        } else {
          return res.send(new APIResult(200, Utility.encodeResults({
                    userId: user.id,
                    token: token
              })));
        }
    });
});

module.exports = router;
