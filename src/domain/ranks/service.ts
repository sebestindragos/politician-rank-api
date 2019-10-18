import * as exceptional from "exceptional.js";

import { IService } from "../../application/IService";
import { Logger } from "../../application/process/logger";
import { Politician } from "./kernel/politician";
import { IPolitician } from "./kernel/IPolitician";
import { IRepository } from "../../application/repository/IRepository";
import { IUser } from "../users/kernel/IUser";
import { IVote } from "./kernel/IVote";
import { Vote } from "./kernel/vote";

export const SERVICE_NAME = "politician-rank";

const EXCEPTIONAL = exceptional.context(SERVICE_NAME);

export class PoliticianRankService implements IService {
  name = SERVICE_NAME;

  /**
   * Class constructor.
   */
  constructor(
    private _politiciansRepo: IRepository<IPolitician>,
    private _votesRepo: IRepository<IVote>
  ) {}

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

  /**
   * Get a politician by id.
   */
  async getPoliticianById(id: number): Promise<IPolitician> {
    return this._findPoliticianById(id);
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

  /**
   * Add a new user upvote.
   */
  async addUpvote(user: IUser, politician: IPolitician) {
    let foundVote = await this._votesRepo.findOne({
      userId: user.id,
      politicianId: politician.id
    });

    if (!foundVote) {
      const newVote = Vote.create(user.id, politician.id);
      await this._votesRepo.insertOne(newVote);
      foundVote = await this._votesRepo.findOne({
        userId: user.id,
        politicianId: politician.id
      });
    }

    if (!foundVote) throw EXCEPTIONAL.GenericException(10, {});

    const vote = new Vote(foundVote);
    vote.addUpvote();

    // update db
    await this._votesRepo.updateOne({ id: vote.id }, { upVotes: vote.upVotes });
    await this._politiciansRepo.updateOne(
      { id: politician.id },
      { upVotes: politician.upVotes + 1 }
    );
  }

  /**
   * Add a new user downvote.
   */
  async addDownvote(user: IUser, politician: IPolitician) {
    let foundVote = await this._votesRepo.findOne({
      userId: user.id,
      politicianId: politician.id
    });

    if (!foundVote) {
      const newVote = Vote.create(user.id, politician.id);
      await this._votesRepo.insertOne(newVote);
      foundVote = await this._votesRepo.findOne({
        userId: user.id,
        politicianId: politician.id
      });
    }

    if (!foundVote) throw EXCEPTIONAL.GenericException(10, {});

    const vote = new Vote(foundVote);
    vote.addDownvote();

    // update db
    await this._votesRepo.updateOne(
      { id: vote.id },
      { downVotes: vote.downVotes }
    );
    await this._politiciansRepo.updateOne(
      { id: politician.id },
      { downVotes: politician.downVotes + 1 }
    );
  }

  /**
   * Find a politician by id.
   */
  private async _findPoliticianById(id: number): Promise<IPolitician> {
    const found = await this._politiciansRepo.findOne({ id });

    if (!found) throw EXCEPTIONAL.NotFoundException(11, { politicianId: id });

    return found;
  }
}
