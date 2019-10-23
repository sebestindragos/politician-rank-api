import { expect } from "chai";

import { User } from "../../src/domain/users/kernel/user";

describe("User class", () => {
  it("should makes email all lower case", () => {
    const user = User.create({
      email: "dragos@email.coM",
      plainPassword: "123456",
      firstname: "dragos",
      lastname: "sebestin"
    });

    expect(user.email).to.be.equal("dragos@email.com");
  });
});
