export interface IMailer {
  send(): void;
}

export class NullMailer implements IMailer {
  send() {}
}
