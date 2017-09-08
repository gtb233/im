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
    router.post("/api/setUserList", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().setUserList(req, res, next);
    });
    router.post("/api/getUserInfo", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().getUserInfo(req, res, next);
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
    * 获取token
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
   * 获取盖讯通TOKEN与用户信息
    * @param req 
    * @param res 
    * @param next 
   */
  public async gxtToken(req: Request, res: Response, next: NextFunction){
    res.header("Access-Control-Allow-Origin", "*");
    const check = tool.checkToken(req.body.userId, req.body.storeId, req.body.token)
    if (!check) {
      res.send("token 验证失败，您在当前页面停留过久，请刷新重试！");
      return true;
    }
    // 默认客服号替换成可查询用户ID
    if (req.body.storeId === 'GW00000001') {
      req.body.storeId = req.body.userId
    }
    //请求核心接口获取用户信息，若不存在则不再查询
    let userInfoRst = new core.userInfoRst();
    userInfoRst.code = req.body.userId;
    let userInfo = await core.exec(userInfoRst);
    userInfoRst.code = req.body.storeId;
    let storeInfo = await core.exec(userInfoRst);
    
    // console.log(userInfo)
    // console.log(storeInfo)
    if (userInfo.code !== '' || storeInfo.code !== '') {
      // 用户信息验证失败
      let data: Object = {
        result: 403,
        tag: '用户或商家不存在！',
        data: {}
      }
      res.send(data);
    } else {
      // 获取盖讯通
      const rst = new gxtToken.TokenRst();
      // rst.fromgw = JSON.stringify({
      //   userId: req.body.userId,
      //   userNickname: userInfo.data.userName ? userInfo.data.userName : '',
      //   userHead: userInfo.data.userHead ? userInfo.data.userHead : ''
      // })
      // rst.togw = JSON.stringify({
      //   storeId: req.body.storeId,
      //   userNickname: storeInfo.data.userName ? storeInfo.data.userName : '',
      //   userHead: storeInfo.data.userHead ? storeInfo.data.userHead : ''
      // })
      rst.fromgw = req.body.userId;
      rst.togw = req.body.storeId;
      //补充提交数据
      // rst.fromUserNickname = userInfo.data.userName ? userInfo.data.userName : '' ;
      // rst.fromUserHead = userInfo.data.userHead ? userInfo.data.userHead : '' ;
      // rst.toUserNickname = storeInfo.data.userName ? storeInfo.data.userName : '' ;
      // rst.toUserHead = storeInfo.data.userHead ? storeInfo.data.userHead : '' ;
      console.log(rst)
      let data: any  = await gxtToken.exec(rst);
      if(data.result == '1'){
        data.data.fromgw.userInfo = userInfo.data
        data.data.togw.userInfo = storeInfo.data
      }
      console.log(data);
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
    // rst.sentTime = req.body.sentTime
    rst.messagesNumber = req.body.messagesNumber
    rst.userLogo = req.body.userLogo
    rst.userName = req.body.userName
    rst.message = req.body.message
    console.log(rst)

    const data = await redis.setUserList(req.body.userId, rst)
    res.send(data)
  }

  /**
   * 取得用户基础信息
   * @param req 
   * @param res 
   * @param next 
   */
  public async getUserInfo(req: Request, res: Response, next: NextFunction){
    const rst = new userInfo.userInfoRst
    rst.userId = req.body.userId

    const data = await userInfo.exec(rst);
    res.send(data)
  }
}