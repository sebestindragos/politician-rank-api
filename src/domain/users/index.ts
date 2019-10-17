import * as aws from "aws-sdk";

import { UserService } from "./service";
import { IMailer } from "../../application/util/mailer";
// import { Logger } from "../../application/process/logger";

export function instantiate(
  mailer: IMailer,
  db: aws.DynamoDB.DocumentClient
): UserService {
  const service = new UserService(mailer, db);

  // tests
  // service
  //   .registerAccount({
  //     email: "dragos@mail.com",
  //     password: "123456",
  //     firstname: "dragos",
  //     lastname: "sebestin"
  //   })
  //   .then(() => {
  //     Logger.get().write("user registered");
  //   })
  //   .catch(error => Logger.get().error(error));

  return service;
}
