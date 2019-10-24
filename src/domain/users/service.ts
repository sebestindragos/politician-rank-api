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
import { ITempToken } from "./kernel/ITempToken";
import { EmailRenderer } from "./emails/renderer";
import { TempToken } from "./kernel/tempToken";

export const SERVICE_NAME = "users";

const EXCEPTIONAL = exceptional.context(SERVICE_NAME);

/**
 * Class implementing the users service.
 *
 * @author Dragos Sebestin
 */
export class UserService implements IService {
  private _emailRenderer = new EmailRenderer();

  name = SERVICE_NAME;

  /**
   * Class constructor.
   */
  constructor(
    private _mailer: IMailer,
    private _usersRepo: IRepository<IUser>,
    private _tempTokensRepo: IRepository<ITempToken>
  ) {}

  /**
   * Create a new user account.
   *
   * @returns {string} authentication jwt token
   */
  async registerAccount({
    emailAddress,
    password,
    firstname,
    lastname
  }: {
    emailAddress: string;
    password: string;
    firstname: string;
    lastname?: string;
  }) {
    Logger.get().write("registering new user account");
    let user = User.create({
      email: emailAddress,
      plainPassword: password,
      firstname,
      lastname
    });

    // check if email is already used
    const found = await this._usersRepo.findOne({ email: emailAddress });
    if (found) {
      Logger.get().write("email is already used");
      throw EXCEPTIONAL.ConflictException(12, { email: emailAddress });
    }

    // save to db
    await this._usersRepo.insertOne(user);

    // create a new temp token
    const tempToken = TempToken.create(user.id);
    await this._tempTokensRepo.insertOne(tempToken);

    // send confirmation email
    const email = this._emailRenderer.createUserRegisteredEmail({
      from: dotenv.email.noreplyAddress,
      to: [user.email],
      data: {
        name: user.firstname,
        token: tempToken.uuid
      }
    });
    await this._mailer.send(email);

    Logger.get().write("new user account registered");

    return this._buildAuthToken(user);
  }

  /**
   * Confirm a user account.
   */
  async confirmAccount(userId: number, tempToken: string) {
    Logger.get().write("confirming user account ...");
    const foundToken = await this._tempTokensRepo.findOne({ uuid: tempToken });
    if (!foundToken) {
      throw EXCEPTIONAL.NotFoundException(14, {});
    }

    const foundUser = await this._usersRepo.findOne({ id: userId });
    if (!foundUser) {
      throw EXCEPTIONAL.NotFoundException(13, { id: userId });
    }

    // deactivate token
    const token = new TempToken(foundToken);
    if (token.isExpired()) {
      throw EXCEPTIONAL.NotFoundException(14, { id: userId });
    }
    token.disable();
    this._tempTokensRepo.updateOne({ id: token.id }, { active: token.active });

    // activate user
    const user = new User(foundUser);
    user.activate();
    await this._usersRepo.updateOne({ id: user.id }, { active: user.active });

    Logger.get().write("user account confirmed");

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
