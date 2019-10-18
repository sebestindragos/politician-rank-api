import * as bcrypt from "bcrypt";

// util
import * as StringUtil from "../../../application/util/helpers/string";

// types
import { IUser } from "./IUser";

/**
 * Class used for working with user objects.
 *
 * @author Dragos Sebestin
 */
export class User implements IUser {
  public id: number;
  public email: string;
  public password?: string;
  public firstname: string;
  public lastname?: string;
  public active: 0 | 1;

  /**
   * Class constructor.
   */
  constructor(data: IUser) {
    this.id = data.id;
    this.email = data.email;
    this.password = data.password;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.active = data.active;
  }

  /**
   * Create a new user object.
   */
  static create({
    email,
    plainPassword,
    firstname,
    lastname
  }: {
    email: string;
    plainPassword: string;
    firstname: string;
    lastname?: string;
  }) {
    return new User({
      id: 0,
      email: email.trim().toLowerCase(),
      password: bcrypt.hashSync(plainPassword, 12),
      firstname: StringUtil.capitalize(firstname.trim()),
      lastname: lastname ? StringUtil.capitalize(lastname.trim()) : undefined,
      active: 0
    });
  }

  /**
   * Check if a provided password is matching the stored one.
   */
  checkPassword(pwd: string): boolean {
    if (!this.password) throw new Error("Account has no password set.");
    return bcrypt.compareSync(pwd, this.password);
  }
}
