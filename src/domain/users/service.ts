import * as jwt from "jsonwebtoken";
import * as exceptional from "exceptional.js";

import { IService } from "../../application/IService";
import { User } from "./kernel/User";
import { IMailer } from "../../application/util/mailer";
import { Logger } from "../../application/process/logger";
import { IUser } from "./kernel/IUser";
import { IAuthToken } from "./kernel/IAuthToken";
import { dotenv } from "../../application/env";
import { IRepository } from "../../application/repository/IRepository";

export const SERVICE_NAME = "users";

const EXCEPTIONAL = exceptional.context(SERVICE_NAME);

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
    private _usersRepo: IRepository<IUser>
  ) {}

  /**
   * Create a new user account.
   *
   * @returns {string} authentication jwt token
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
    Logger.get().write("registering new user account");
    let user = User.create({
      email,
      plainPassword: password,
      firstname,
      lastname
    });

    // check if email is already used
    const found = await this._usersRepo.findOne({ email });
    if (found) {
      Logger.get().write("email is already used");
      throw EXCEPTIONAL.ConflictException(12, { email });
    }

    // save to db
    await this._usersRepo.insertOne(user);

    // send confirmation email
    this._mailer;

    Logger.get().write("new user account registered");

    return this._buildAuthToken(user);
  }

  /**
   * Login a user with his credentials.
   */
  async login(email: string, password: string) {
    const email2 = email.trim().toLowerCase();

    // find user
    let user = new User(await this._findUserByEmail(email2));
    if (!user.checkPassword(password)) {
      // password is not ok, error out
      throw EXCEPTIONAL.DomainException(11, {});
    }

    // if everything is ok, send back the token
    return this._buildAuthToken(user);
  }

  /**
   * Find a user by its id.
   */
  async findById(id: number): Promise<IUser> {
    const found = await this._findUserById(id);

    // remove sensitive data
    delete found.password;

    return found;
  }

  /**
   * Create an authentication token from client credentials.
   */
  private _buildAuthToken(user: IUser) {
    const tokenData: IAuthToken = {
      userId: user.id
    };

    return jwt.sign(tokenData, dotenv.jwtSecret, {
      expiresIn: 60 * 60 * 24 * 30 // 1 month
    });
  }

  /**
   * Find a user by email.
   */
  private async _findUserByEmail(email: string): Promise<IUser> {
    const found = await this._usersRepo.findOne({ email });

    if (!found) throw EXCEPTIONAL.NotFoundException(10, { email: email });

    return found;
  }

  /**
   * Find a user by id.
   */
  private async _findUserById(id: number): Promise<IUser> {
    const found = await this._usersRepo.findOne({ id });

    if (!found) throw EXCEPTIONAL.NotFoundException(13, { id: id });

    return found;
  }
}
