import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import * as token from '../sdk/rong/token';
import * as gxtToken from '../sdk/gxt/token';
import * as userInfo from '../sdk/gxt/userInfo';
import * as tool from '../lib/util';
import * as redis from '../lib/redis';
import * as core from '../sdk/core/userInfo'

/**
 * / route
 *
 * @class User
 */
export class ApiRoute extends BaseRoute {

  /**
   * Create the routes.
   *
   * @class IndexRoute
   * @method create
   * @static
   */
  public static create(router: Router) {
    //log
    console.log("Creating api route.");

    //add home page route
    router.get("/api", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().index(req, res, next);
    });

    router.post("/api/token", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().token(req, res, next);
    });

    router.post("/api/gxtToken", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().gxtToken(req, res, next);
    });

    router.post("/api/getUserList", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().getUserList(req, res, next);
    });
    /* 用户会话列表 */
    router.post("/api/setUserList", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().setUserList(req, res, next);
    });
    /* 用户盖讯通与商城信息 */
    router.post("/api/getUserInfo", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().getUserInfo(req, res, next);
    });
    /* 指定对话用户历史消息 */
    router.post("/api/getHistoryMsg", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().getHistoryMsg(req, res, next);
    });
    /* 指定对话用户历史消息 */
    router.post("/api/changeMsgNumber", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().changeMsgNumber(req, res, next);
    });
  }
  /**
   * The home page route.
   *
   * @class IndexRoute
   * @method index
   * @param req {Request} The express Request object.
   * @param res {Response} The express Response object.
   * @next {NextFunction} Execute the next method.
   */
  public index(req: Request, res: Response, next: NextFunction) {
    res.send("api 接口");
  }


  /**
    * 获取token （融云版）
    * @param req 
    * @param res 
    * @param next 
    */
  public async token(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    const check = tool.checkToken(req.body.userId, req.body.storeId, req.body.token)
    if (!check) {
      res.send("token 验证失败，您在当前页面停留过久，请刷新重试！");
    } else {
      //console.log(req.body);
      const rst = new token.TokenRst();
      rst.userId = req.body.userId;
      rst.name = req.body.name
      rst.portraitUri = req.body.portraitUri
      const data = await token.exec(rst);
      res.send(data)
    }

  }

  /**
   * 获取盖讯通TOKEN与用户信息 （盖讯通版）
    * @param req 
    * @param res 
    * @param next 
   */
  public async gxtToken(req: Request, res: Response, next: NextFunction){
    res.header("Access-Control-Allow-Origin", "*");
    
    //取消限制-放行
    // const check = tool.checkToken(req.body.userId, req.body.storeId, req.body.token);
    // if (!check) {
    //   res.send("token 验证失败，您在当前页面停留过久，请刷新重试！");
    //   return true;
    // }
    
    // 默认客服号替换成可查询用户ID
    // if (req.body.storeId === 'GW00000001') {
    //   req.body.storeId = req.body.userId;
    // }
    
    //请求核心接口获取用户信息，若不存在则不再查询
    let userInfoRst = new core.userInfoRst();
    userInfoRst.code = req.body.userId; // GW号
    let userInfo = await core.exec(userInfoRst);
    userInfoRst.code = req.body.storeId;
    let storeInfo = await core.exec(userInfoRst);

    // console.log(userInfo);
    if (userInfo.code == 0 || storeInfo.code == 0) {
      // 用户信息验证失败
      let data: Object = {
        resultCode: '403',
        tag: '用户或商家不存在！',
        data: {}
      }
      res.send(data);
    } else {
      // TOKEN改为缓存记录，不再每次都重新获取。盖讯通设置有效期一个月，此暂定60分钟
      let data: any = await redis.getRongCloudToken(req.body.userId, req.body.storeId);
      // console.log('data:',data)
      if(data == null || !data){
        // 获取盖讯通 新请求结构,当无用户名时使用GW号
        const rst = new gxtToken.TokenRst();
        rst.fromgw = { // 登录的用户
          GW: req.body.userId,
          userNickname: userInfo.data.nickname ? userInfo.data.nickname : userInfo.data.userName,
          userHead: userInfo.data.userHead ? userInfo.data.userHead : ''
        };
        rst.togw = {
          GW: req.body.storeId,
          userNickname: storeInfo.data.nickname ? storeInfo.data.nickname : storeInfo.data.userName,
          userHead: storeInfo.data.userHead ? storeInfo.data.userHead : ''
        };
        // console.log(rst)

        data = await gxtToken.exec(rst);
        // console.log('new:',data)
        if(data.resultCode == '0001'){
          data.resultData.fromgw.userInfo = userInfo.data; //追加完整用户信息数据
          data.resultData.togw.userInfo = storeInfo.data;
        } else {
          return false;
        }
        redis.setRongCloudToken(req.body.userId, req.body.storeId, data);
      }else{
        data = JSON.parse(data);
      }
      
      res.send(data);
    }
  }

  /**
   * 取得服务端缓存会话列表  redis
   * @param req 
   * @param res 
   * @param next 
   */
  public async getUserList(req: Request, res: Response, next: NextFunction){
    const data = await redis.getUserList(req.body.userId)
    res.send(data)
    // console.log("获取到的数据：",data)
  }

  /**
   * 设置会话列表用户信息 redis
   * @param req 
   * @param res 
   * @param next 
   */
  public async setUserList(req: Request, res: Response, next: NextFunction){
    const rst = new redis.setRst
    rst.targetId = req.body.targetId
    rst.lastMessage = req.body.lastMessage
    rst.lastMsgType = req.body.lastMsgType
    // rst.sentTime = req.body.sentTime
    rst.messagesNumber = <number>req.body.messagesNumber * 1
    rst.userLogo = req.body.userLogo
    rst.userName = req.body.userName
    rst.message = req.body.message
    rst.gwCode = req.body.gwCode
    // console.log('setUserlist: ', rst.message)

    const data = await redis.setUserList(req.body.userId, rst)
    // 记录到历史消息
    let msgRst = new redis.setHistoryMsgRst
    msgRst = rst.message
    redis.setHistoryMsg(req.body.userId, req.body.targetId, msgRst)

    res.send(data)
  }

  /**
   * 获取历史消息列表（默认前15条）
   */
  public async getHistoryMsg(req: Request, res: Response, next: NextFunction){
    const result:any = await redis.getHistoryMsg(req.body.userId, req.body.targetId, -15, -1)

    res.send(result)
  }

  /**
   * 更新用户消息提示数
   */
  public async changeMsgNumber(req: Request, res: Response, next: NextFunction){
    const result:any = await redis.getUserList(req.body.userId)
    // console.log('用户列表',result)
    // 更新指定参数
    const rst = new redis.setRst
    for(let k in result) {
      // console.log(result[k])
      let _targetId = result[k].targetId
      if(_targetId == req.body.targetId){
        rst.targetId = req.body.targetId
        rst.lastMessage = result[k].lastMessage
        rst.lastMsgType = result[k].lastMsgType
        rst.messagesNumber = 0
        rst.userLogo = result[k].userLogo
        rst.userName = result[k].userName
        rst.gwCode = result[k].gwCode

        await redis.setUserList(req.body.userId, rst)
      }
    }
    res.send([])
  }

  /**
   * 取得用户基础信息
   * @param req 
   * @param res 
   * @param next 
   */
  public async getUserInfo(req: Request, res: Response, next: NextFunction){
    const rst = new userInfo.userInfoRst
    rst.code = req.body.userId

    const data = await userInfo.exec(rst);
    if (data.result == 1){
      //请求核心接口获取用户信息，若不存在则不再查询
      let userInfoRst = new core.userInfoRst();
      userInfoRst.code = data.entity.userName; // GW号
      let info = await core.exec(userInfoRst);
      data.userInfo = info.data // 商城用户信息
    }

    res.send(data)
  }
}