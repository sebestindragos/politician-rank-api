import * as express from "express";
import * as bodyParser from "body-parser";
import * as compression from "compression";
import * as helmet from "helmet";
import * as cors from "cors";
import { App } from "./app";
import { ApiGateway } from "./gateway";
import { dotenv } from "./application/env";
import { initErrorSubsystem } from "./application/errors";

export const expressApp = express();
export const app = new App();

export async function bootstrap() {
  // load errors subsystem
  initErrorSubsystem("ro"); // ro locale for now

  // start the app
  await app.start();

  // to be used only with a frontend (nginx or any load balancer)
  // (by default req.ip will ignore the 'x-forwarded-for' header)
  expressApp.enable("trust proxy");

  // redirect http -> https
  expressApp.use((req, res, next) => {
    // check for load balancer forwarded protocol header, not the direct protocol which will always be HTTP
    if (req.headers["x-forwarded-proto"] === "http") {
      let host = req.hostname.replace(/^www\./i, "");
      let href = `https://${host}${req.url}`;
      return res.redirect(href);
    }

    let wwwRx = /^www\./i;
    if (wwwRx.test(req.hostname)) {
      let host = req.hostname.replace(/^www\./i, "");
      let href = `https://${host}${req.url}`;
      return res.redirect(href);
    }

    next();
  });

  // load balancer health check route
  expressApp.get("/health-check", (_req, res) => res.end());

  // configure middleware
  expressApp.use(helmet({}));
  expressApp.use(helmet.referrerPolicy());
  expressApp.use(bodyParser.json());
  expressApp.use(compression());
  expressApp.use(
    cors({
      origin: [/localhost/i, /192.168.88/i, /domainname.com/i]
    })
  );

  // load API gateway
  const gateway = new ApiGateway(dotenv.engine.apiVersion, app.registry);
  expressApp.use(gateway.router);
}

export async function tearDown() {
  if (app) {
    await app.stop();
  }
}
