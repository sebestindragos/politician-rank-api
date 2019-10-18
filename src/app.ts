import * as mariadb from "mariadb";

import { ServiceRegistry } from "./application/serviceRegistry";
import { instantiate as instantiateUserService } from "./domain/users";
import { instantiate as instantiateRankService } from "./domain/ranks";

import { IMailer, NullMailer } from "./application/util/mailer";
import { Logger } from "./application/process/logger";
import { dotenv } from "./application/env";

/**
 * Class managing the application instance.
 *
 * @author Dragos Sebestin
 */
export class App {
  private _mailer?: IMailer;
  private _mysqlPool?: mariadb.Pool;

  public registry = new ServiceRegistry();

  /**
   * Start the app instance.
   */
  async start() {
    // init infrastructure
    this._mailer = new NullMailer();
    this._mysqlPool = mariadb.createPool(dotenv.mysql);

    // init services
    this._initUsers(this._mailer, this._mysqlPool);
    this._initRanks(this._mysqlPool);

    Logger.get().write("*** Application started ***");
  }

  /**
   * Stop the app instance.
   */
  async stop() {
    if (this._mysqlPool) await this._mysqlPool.end();
    Logger.get().write("*** Application closed ***");
  }

  /**
   * Init users service.
   */
  private _initUsers(mailer: IMailer, pool: mariadb.Pool) {
    const service = instantiateUserService(mailer, pool);
    this.registry.add(service);
  }

  /**
   * Init ranking service.
   */
  private _initRanks(db: mariadb.Pool) {
    const service = instantiateRankService(db);
    this.registry.add(service);
  }
}
