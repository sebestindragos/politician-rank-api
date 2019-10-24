export interface IEmail {
  from: string;
  to: string[];
  subject: string;
  text: string;
  html: string;
}

export interface IMailer {
  send(params: IEmail): Promise<void>;
}

/**
 * Mailer class used for debugging. It only
 * prints to console.
 */
export class NullMailer implements IMailer {
  async send(params: IEmail) {
    console.log(params);
  }
}
