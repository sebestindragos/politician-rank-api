import { IPolitician } from "./IPolitician";

export class Politician implements IPolitician {
  public id: number;
  public firstname: string;
  public lastname: string;
  public profilePictureUrl: string;
  public description: string;
  public upVotes: number;
  public downVotes: number;

  /**
   * Class constructor.
   */
  constructor(data: IPolitician) {
    this.id = data.id;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.profilePictureUrl = data.profilePictureUrl;
    this.description = data.description;
    this.upVotes = data.upVotes;
    this.downVotes = data.downVotes;
  }

  /**
   * Create a new politician instance.
   */
  static create({
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
    return new Politician({
      id: 0,
      firstname: (firstname || "").trim(),
      lastname: (lastname || "").trim(),
      profilePictureUrl,
      description,
      upVotes: 0,
      downVotes: 0
    });
  }
}
