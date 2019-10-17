import * as express from "express";

import {
  SERVICE_NAME as USER_SERVICE_NAME,
  UserService
} from "../../domain/users/service";
import { ServiceRegistry } from "../../application/serviceRegistry";

export function get(registry: ServiceRegistry): express.Router {
  let router = express.Router();

  let users = registry.getInstance(USER_SERVICE_NAME) as UserService;

  router.post("/users/register", async (req, res, next) => {
    try {
      users;
      // await users.registerAccount();

      res.json({});
    } catch (error) {
      next(error);
    }
  });

  return router;
}
