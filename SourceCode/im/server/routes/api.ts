import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import * as login from '../sdk/openApi/login'
import * as token from '../sdk/rong/token'
import * as gxtToken from '../sdk/gxt/token'

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

    router.get("/api/login", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().login(req, res, next);
    });

    router.get("/api/token", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().token(req, res, next);
    });

    router.get("/api/gxtToken", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().gxtToken(req, res, next);
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
   * 登录
   * @param req 
   * @param res 
   * @param next 
   */
  public async login(req: Request, res: Response, next: NextFunction) {
    const rst = new login.loginRst();
    rst.loginInfo = '0\tGW78829820\t123456\t';
    const data = await login.exec(rst);
    console.log(data)
    res.send(data);
  }

  /**
    * 获取token
    * @param req 
    * @param res 
    * @param next 
    */
  public async token(req: Request, res: Response, next: NextFunction) {
    const rst = new token.TokenRst();
    rst.userId = req.query.userId;
    rst.name = req.query.name
    rst.portraitUri = req.query.portraitUri
    const data = await token.exec(rst);
    res.send(data)
  }

  /**
   * 获取盖讯通TOKEN与用户信息
    * @param req 
    * @param res 
    * @param next 
   */
  public async gxtToken(req: Request, res: Response, next: NextFunction){
    //验证来源
    let checkToken = req.query.checkToken;
    // if (!checkToken) {
    //   res.send('error') // 待改成具体错误参数
    // }
    let newToken = ''; // 通过统一算法计算取得，待补充
    // if (checkToken !== newToken){
    //   res.send('error2')
    // }

    const rst = new gxtToken.TokenRst();
    rst.fromgw = req.query.userId;
    rst.togw = req.query.storeId
    const data = await gxtToken.exec(rst);
    res.send(data)
  }
}