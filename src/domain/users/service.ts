import * as aws from "aws-sdk";

import { IService } from "../../application/IService";
import { User } from "./kernel/User";
import { IMailer } from "../../application/util/mailer";
import { Logger } from "../../application/process/logger";

export const SERVICE_NAME = "users";

const USERS_TABLE_NAME = "users";

/**
 * Class implementing the users service.
 *
 * @author Dragos Sebestin
 */
export class UserService implements IService {
  name = SERVICE_NAME;

  /**
   * Class constructor.
   */
  constructor(
    private _mailer: IMailer,
    private _db: aws.DynamoDB.DocumentClient
  ) {}

  /**
   * Create a new user account.
   */
  async registerAccount({
    email,
    password,
    firstname,
    lastname
  }: {
    email: string;
    password: string;
    firstname: string;
    lastname?: string;
  }) {
    let user = User.create({
      email,
      plainPassword: password,
      firstname,
      lastname
    });

    // save to db
    await this._db.put({ TableName: USERS_TABLE_NAME, Item: user }).promise();

    // send confirmation email
    this._mailer;

    Logger.get().write("new user account registered");
  }
}
