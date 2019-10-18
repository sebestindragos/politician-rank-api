import * as mariadb from "mariadb";

import { UserService } from "./service";
import { IMailer } from "../../application/util/mailer";
import { MySqlRepository } from "../../application/repository/mysqlRepository";

export function instantiate(mailer: IMailer, db: mariadb.Pool): UserService {
  // init repositories
  const usersRepo = new MySqlRepository(db, "users");

  // init service
  const service = new UserService(mailer, usersRepo);

  return service;
}
