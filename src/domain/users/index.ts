import * as mariadb from "mariadb";

import { UserService } from "./service";
import { IMailer } from "../../application/util/mailer";
import { MySqlRepository } from "../../application/repository/mysqlRepository";
import { ITempToken } from "./kernel/ITempToken";
import { IUser } from "./kernel/IUser";

export function instantiate(mailer: IMailer, db: mariadb.Pool): UserService {
  // init repositories
  const usersRepo = new MySqlRepository<IUser>(db, "users");
  const tempTokensRepo = new MySqlRepository<ITempToken>(db, "temp-tokens");

  // init service
  const service = new UserService(mailer, usersRepo, tempTokensRepo);

  return service;
}
