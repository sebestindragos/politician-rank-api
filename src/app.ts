import * as aws from "aws-sdk";

import { ServiceRegistry } from "./application/serviceRegistry";
import { instantiate as instantiateUserService } from "./domain/users";
import { IMailer, NullMailer } from "./application/util/mailer";
import { Logger } from "./application/process/logger";
import { dotenv } from "./application/env";

/**
 * Class managing the application instance.
 *
 * @author Dragos Sebestin
 */
export class App {
  private _registry = new ServiceRegistry();
  private _mailer?: IMailer;
  private _dynamoDbClient?: aws.DynamoDB.DocumentClient;

  /**
   * Start the app instance.
   */
  async start() {
    // init infrastructure
    this._mailer = new NullMailer();
    this._dynamoDbClient = new aws.DynamoDB.DocumentClient(dotenv.aws);

    // init services
    this._initUsers(this._mailer, this._dynamoDbClient);

    Logger.get().write("*** Application started ***");
  }

  /**
   * Stop the app instance.
   */
  async stop() {
    Logger.get().write("*** Application closed ***");
  }

  /**
   * Init users service.
   */
  private _initUsers(mailer: IMailer, db: aws.DynamoDB.DocumentClient) {
    const service = instantiateUserService(mailer, db);
    this._registry.add(service);
  }
}
