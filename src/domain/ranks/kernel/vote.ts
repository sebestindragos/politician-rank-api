import { IVote } from "./IVote";

export class Vote implements IVote {
  public id: number;
  public userId: number;
  public politicianId: number;
  public upVotes: number;
  public downVotes: number;

  /**
   * Class constructor.
   */
  constructor(data: IVote) {
    this.id = data.id;
    this.userId = data.userId;
    this.politicianId = data.politicianId;
    this.upVotes = data.upVotes;
    this.downVotes = data.downVotes;
  }

  /**
   * Create a new rank.
   */
  static create(userId: number, politicianId: number) {
    return new Vote({ id: 0, userId, politicianId, upVotes: 0, downVotes: 0 });
  }

  /**
   * Add a new upvote.
   */
  addUpvote() {
    this.upVotes++;
  }

  /**
   * Add a new downvote.
   */
  addDownvote() {
    this.downVotes++;
  }
}
