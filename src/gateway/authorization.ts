import * as express from "express";
import * as jwt from "jsonwebtoken";
import { context } from "exceptional.js";
import { dotenv } from "../application/env";
import { IAuthToken } from "../domain/users/kernel/IAuthToken";

const EXCEPTIONAL = context("default");

/**
 * Middleware used to check if a user is authorized to access a route (via JWT).
 */
export function isAuthorized() {
  return function(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res;
    let authorizationHeader =
      req.headers["Authorization"] || req.headers["authorization"];
    if (typeof authorizationHeader === "string") {
      let token = authorizationHeader.substr(7);
      if (!token) {
        return next(EXCEPTIONAL.UnauthorizedException(4, {}));
      }

      jwt.verify(token, dotenv.jwtSecret, (err: any, decodedToken) => {
        if (err) {
          return next(EXCEPTIONAL.UnauthorizedException(4, {}));
        } else {
          const tokenData = decodedToken as IAuthToken;
          Object.defineProperty(req, "user", {
            value: {
              _id: tokenData.userId
            }
          });
          next();
        }
      });
    } else {
      return next(EXCEPTIONAL.UnauthorizedException(4, {}));
    }
  };
}
