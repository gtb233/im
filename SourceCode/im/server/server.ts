import * as bodyParser from "body-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";

import { ApiRoute } from "./routes/api";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  public esp: any;

  public app: express.Application;

  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    this.esp = express;
    //create expressjs application
    this.app = this.esp();

    //configure application
    this.config();

    //add routes
    this.routes();
  }


  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    //add static paths
    /*     this.app.use(express.static(path.join(__dirname, "public"))); */

    //configure pug
    /*     this.app.set("views", path.join(__dirname, "views"));
        this.app.set("view engine", "pug"); */

    //mount logger
    this.app.use(logger("dev"));

    //mount json form parser
    this.app.use(bodyParser.json());

    //mount query string parser
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    // catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });

  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    //IndexRoute
    ApiRoute.create(router);

    //use router middleware
    this.app.use(router);
  }

}