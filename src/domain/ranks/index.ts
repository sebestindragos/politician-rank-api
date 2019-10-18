import * as mariadb from "mariadb";

import { PoliticianRankService } from "./service";
import { MySqlRepository } from "../../application/repository/mysqlRepository";

export function instantiate(db: mariadb.Pool): PoliticianRankService {
  // init repositories
  const politiciansRepo = new MySqlRepository(db, "politicians");

  // init service
  const service = new PoliticianRankService(politiciansRepo);

  return service;
}
