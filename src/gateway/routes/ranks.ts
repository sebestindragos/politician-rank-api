import * as express from "express";
import { Schema } from "inpt.js";

import {
  SERVICE_NAME as POLITICIANS_SERVICE_NAME,
  PoliticianRankService
} from "../../domain/ranks/service";
import {
  SERVICE_NAME as USER_SERVICE_NAME,
  UserService
} from "../../domain/users/service";

import { ServiceRegistry } from "../../application/serviceRegistry";
import { transform, transformQ } from "../transform";
import { isAuthorized } from "../authorization";

export function get(registry: ServiceRegistry): express.Router {
  const router = express.Router();

  const users = registry.getInstance(USER_SERVICE_NAME) as UserService;
  const ranks = registry.getInstance(
    POLITICIANS_SERVICE_NAME
  ) as PoliticianRankService;

  router.post(
    "/ranks/politicians",
    isAuthorized(),
    transform(
      new Schema({
        firstname: Schema.Types.String,
        lastname: Schema.Types.String,
        profilePictureUrl: Schema.Types.String,
        description: Schema.Types.String
      })
    ),
    async (req, res, next) => {
      try {
        const {
          firstname,
          lastname,
          profilePictureUrl,
          description
        }: {
          firstname: string;
          lastname: string;
          profilePictureUrl: string;
          description: string;
        } = req.body;

        const politician = await ranks.addPolitician({
          firstname,
          lastname,
          profilePictureUrl,
          description
        });

        res.send({ result: politician });
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * List politicians.
   */
  router.get(
    "/ranks/politicians",
    transformQ(
      new Schema({
        limit: Schema.Types.Optional(Schema.Types.Number),
        cursorId: Schema.Types.Optional(Schema.Types.String)
      })
    ),
    async (req, res, next) => {
      try {
        const { limit, cursorId } = req.query;
        res.send({ result: await ranks.listPoliticians({ limit, cursorId }) });
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * Register a new upvote.
   */
  router.post(
    "/ranks/politicians/:id/upvote",
    isAuthorized(),
    async (req, res, next) => {
      try {
        const { id }: { id: number } = (req as any).user;
        const { id: politicianId } = req.params;

        const user = await users.findById(id);
        const politician = await ranks.getPoliticianById(
          parseInt(politicianId)
        );
        await ranks.addUpvote(user, politician);

        res.send({ result: {} });
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * Register a new downvote.
   */
  router.post(
    "/ranks/politicians/:id/downvote",
    isAuthorized(),
    async (req, res, next) => {
      try {
        const { id }: { id: number } = (req as any).user;
        const { id: politicianId } = req.params;

        const user = await users.findById(id);
        const politician = await ranks.getPoliticianById(
          parseInt(politicianId)
        );
        await ranks.addDownvote(user, politician);

        res.send({ result: {} });
      } catch (error) {
        next(error);
      }
    }
  );

  return router;
}
