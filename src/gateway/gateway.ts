import * as express from "express";
import * as semver from "semver";
import {
  context,
  IException,
  HttpException,
  ServerException
} from "exceptional.js";

import { Logger } from "../application/process/logger";
import { ServiceRegistry } from "../application/serviceRegistry";
// import {RateLimiter} from '../application/rateLimiter';

// routes
import { get as UserRoutes } from "./routes/users";
import { dotenv } from "../application/env";
const EXCEPTIONAL = context("default");

/**
 * Api gateway class.
 *
 * @author Dragos Sebestin
 */
export class ApiGateway {
  public router: express.Router;

  /**
   * Class constructor.
   */
  constructor(private _apiVersion: string, registry: ServiceRegistry) {
    this.router = express.Router();

    let apiVersion = `v${semver.major(this._apiVersion)}.${semver.minor(
      this._apiVersion
    )}`; // this._apiVersion;
    Logger.get().write(`using HTTP API version ${apiVersion}.`);

    // load api routes
    let apiRouter = express.Router();
    apiRouter.use(UserRoutes(registry));

    this.router.use(`/api/${apiVersion}`, apiRouter);

    // configure router default handlers

    // .UNKOWN API METHOD CALL
    this.router.use(
      `/api/${apiVersion}`,
      async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        req;
        res;
        next(
          EXCEPTIONAL.NotFoundException(1, {
            apiVersion: this._apiVersion
          })
        );
      }
    );

    // .UNKOWN API VERSION CALL
    this.router.use(
      `/api`,
      async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        req;
        res;
        next(EXCEPTIONAL.NotFoundException(2, {}));
      }
    );

    // .ROUTER API ERROR ROUTE
    this.router.use(async function defaultErrorHandler(
      err: IException<any>,
      req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) {
      try {
        let httpEx = new HttpException(err);

        // log API exception
        const shouldLogException =
          dotenv.config === "debug" ? true : httpEx.statusCode === 500;
        if (shouldLogException) {
          let serverException = new ServerException(
            httpEx.statusCode,
            httpEx.error
          );
          Logger.get().error(
            `<===== API_EXCEPTION =====>
[ROUTE]
Method: ${req.method}
Url: ${req.url}
Body: ${JSON.stringify(req.body)}
[MESSAGE]
${serverException.message}
[ORIGINAL]
${JSON.stringify(serverException.exception)}
[STACK]
${(serverException.exception as any).stack}
<================ END_EXCEPTION =================>
`
          );
        }
        res.status(httpEx.statusCode).json(httpEx.error);
      } catch (err) {
        Logger.get().error(err);
        res.status(500).end();
      }
    });
  }
}
