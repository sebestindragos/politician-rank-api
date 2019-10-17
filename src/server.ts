import * as http from "http";
import * as morgan from "morgan";

import { ProcessManager } from "./application/process/manager";
import { Logger } from "./application/process/logger";

import { bootstrap, tearDown, expressApp } from "./main";
import { dotenv } from "./application/env";

let pm = new ProcessManager();
let server = http.createServer(expressApp);

pm.once("start", async () => {
  try {
    // load dev middleware
    expressApp.use(morgan("dev"));

    await bootstrap();

    // start listening
    let host: string = dotenv.hostname;
    let port: number = dotenv.port;
    server.listen(port, host, () => {
      Logger.get().write("magic happens on port", port);
    });
  } catch (error) {
    Logger.get().error(error);
    await tearDown();
  }
});
pm.once("stop", () => {
  Logger.get().write("received shutdown signal, closing server ...");

  server.close();
  // (server as any).shutdown();

  server.once("close", async () => {
    await tearDown();
  });
});
pm.init();
