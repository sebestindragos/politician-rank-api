import * as uuid from "uuid/v4";
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
  public _id: string;
  public email: string;
  public password: string;
  public firstname: string;
  public lastname?: string;

  /**
   * Class constructor.
   */
  constructor(data: IUser) {
    this._id = data._id;
    this.email = data.email;
    this.password = data.password;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
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
      _id: uuid(),
      email: email.trim().toLowerCase(),
      password: bcrypt.hashSync(plainPassword, 12),
      firstname: StringUtil.capitalize(firstname.trim()),
      lastname: lastname ? StringUtil.capitalize(lastname.trim()) : undefined
    });
  }

  /**
   * Check if a provided password is matching the stored one.
   */
  checkPassword(pwd: string): boolean {
    return bcrypt.compareSync(pwd, this.password);
  }
}
