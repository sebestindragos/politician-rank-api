import * as express from "express";
import { App } from "./app";

export let expressApp = express();
let app: App | undefined;

async function bootstrap() {
  app = new App();

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
}

async function tearDown() {
  if (app) {
    await app.stop();
  }
}
