import * as exceptional from "exceptional.js";

import { IService } from "../../application/IService";
import { Logger } from "../../application/process/logger";
import { Politician } from "./kernel/politician";
import { IPolitician } from "./kernel/IPolitician";
import { IRepository } from "../../application/repository/IRepository";

export const SERVICE_NAME = "politician-rank";

const EXCEPTIONAL = exceptional.context(SERVICE_NAME);

export class PoliticianRankService implements IService {
  name = SERVICE_NAME;

  /**
   * Class constructor.
   */
  constructor(private _politiciansRepo: IRepository<IPolitician>) {}

  /**
   * Add a new politician to the collection.
   */
  async addPolitician({
    firstname,
    lastname,
    profilePictureUrl,
    description
  }: {
    firstname: string;
    lastname: string;
    profilePictureUrl: string;
    description: string;
  }) {
    Logger.get().write("adding new politician profile");

    const p = Politician.create({
      firstname,
      lastname,
      profilePictureUrl,
      description
    });

    // save to db
    await this._politiciansRepo.insertOne(p);

    Logger.get().write("politician profile added successfully");

    return p;
  }

  async listPoliticians({
    limit = 20,
    cursorId
  }: {
    limit: number;
    cursorId?: string;
  }): Promise<IPolitician[]> {
    EXCEPTIONAL;
    return this._politiciansRepo.find({}, { limit });
  }
}
