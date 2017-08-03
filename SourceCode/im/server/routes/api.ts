import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import * as login from '../sdk/openApi/login'
import * as token from '../sdk/rong/token'

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

}