import * as uuid from "uuid/v4";

import { ITempToken } from "./ITempToken";

export class TempToken implements ITempToken {
  public id: number;
  public userId: number;
  public uuid: string;
  public createdAt: Date;
  public active: number;

  constructor(data: ITempToken) {
    this.id = data.id;
    this.userId = data.userId;
    this.uuid = data.uuid;
    this.createdAt = data.createdAt;
    this.active = data.active;
  }

  /**
   * Create a new value object.
   */
  static create(userId: number) {
    const tempToken = new TempToken({
      id: 0,
      userId,
      uuid: uuid(),
      createdAt: new Date(),
      active: 1
    });

    return tempToken;
  }

  /**
   * Disable this token.
   */
  disable() {
    this.active = 0;
  }

  /**
   * Check if the token is expired.
   */
  isExpired() {
    return this.active === 0;
  }
}
