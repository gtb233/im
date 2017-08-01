import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import * as login from '../sdk/openApi/login'
import * as sms from '../sdk/psp/sms'
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

    router.get("/api/sms", (req: Request, res: Response, next: NextFunction) => {
      new ApiRoute().sms(req, res, next);
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
   * 发短信
   * @param req 
   * @param res 
   * @param next 
   */
  public async sms(req: Request, res: Response, next: NextFunction) {
    const rst = new sms.SmsRst();
    rst.content = '您的验证码是989988';
    rst.mobile = '15323353829'
    rst.type = 0;
    const data = await sms.exec(rst);
    console.log(data)
    res.send(data);
  }
  


}