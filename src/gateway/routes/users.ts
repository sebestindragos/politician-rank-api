import * as express from "express";
import { Schema } from "inpt.js";

import {
  SERVICE_NAME as USER_SERVICE_NAME,
  UserService
} from "../../domain/users/service";
import { ServiceRegistry } from "../../application/serviceRegistry";
import { transform } from "../transform";
import { isAuthorized } from "../authorization";

export function get(registry: ServiceRegistry): express.Router {
  let router = express.Router();

  let users = registry.getInstance(USER_SERVICE_NAME) as UserService;

  router.post(
    "/users/register",
    transform(
      new Schema({
        email: Schema.Types.String,
        password: Schema.Types.String,
        firstname: Schema.Types.String,
        lastname: Schema.Types.String
      })
    ),
    async (req, res, next) => {
      try {
        const {
          email,
          password,
          firstname,
          lastname
        }: {
          email: string;
          password: string;
          firstname: string;
          lastname: string;
        } = req.body;

        res.json({
          result: await users.registerAccount({
            email,
            password,
            firstname,
            lastname
          })
        });
      } catch (error) {
        next(error);
      }
    }
  );

  router.post(
    "/users/login",
    transform(
      new Schema({
        email: Schema.Types.String,
        password: Schema.Types.String
      })
    ),
    async (req, res, next) => {
      try {
        const {
          email,
          password
        }: { email: string; password: string } = req.body;

        res.json({ result: await users.login(email, password) });
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * Get own user profile.
   */
  router.get("/users/me", isAuthorized(), async (req, res, next) => {
    try {
      const { id }: { id: number } = (req as any).user;

      res.json({ result: await users.findById(id) });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
