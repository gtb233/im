"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const route_1 = require("./route");
const login = require("../sdk/openApi/login");
const token = require("../sdk/rong/token");
/**
 * / route
 *
 * @class User
 */
class ApiRoute extends route_1.BaseRoute {
    /**
     * Create the routes.
     *
     * @class IndexRoute
     * @method create
     * @static
     */
    static create(router) {
        //log
        console.log("Creating api route.");
        //add home page route
        router.get("/api", (req, res, next) => {
            new ApiRoute().index(req, res, next);
        });
        router.get("/api/login", (req, res, next) => {
            new ApiRoute().login(req, res, next);
        });
        router.get("/api/token", (req, res, next) => {
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
    index(req, res, next) {
        res.send("api 接口");
    }
    /**
     * 登录
     * @param req
     * @param res
     * @param next
     */
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const rst = new login.loginRst();
            rst.loginInfo = '0\tGW78829820\t123456\t';
            const data = yield login.exec(rst);
            console.log(data);
            res.send(data);
        });
    }
    /**
      * 获取token
      * @param req
      * @param res
      * @param next
      */
    token(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const rst = new token.TokenRst();
            rst.userId = req.query.userId;
            rst.name = req.query.name;
            rst.portraitUri = req.query.portraitUri;
            const data = yield token.exec(rst);
            res.send(data);
        });
    }
}
exports.ApiRoute = ApiRoute;
//# sourceMappingURL=api.js.map