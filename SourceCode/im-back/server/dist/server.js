"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const logger = require("morgan");
const api_1 = require("./routes/api");
/**
 * The server.
 *
 * @class Server
 */
class Server {
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    static bootstrap() {
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
    config() {
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
        this.app.use(function (err, req, res, next) {
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
    routes() {
        let router;
        router = express.Router();
        //IndexRoute
        api_1.ApiRoute.create(router);
        //use router middleware
        this.app.use(router);
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map