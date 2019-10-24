import { IEmailTemplate } from "./templates/IEmailTemplate";
import { userRegisteredTemplate } from "./templates/userRegistered";
import { IEmail } from "../../../application/util/mailer";

/**
 * Class used for rendering email
 * bodies for different types of email
 * events.
 *
 * @author Dragos Sebestin
 */
export class EmailRenderer {
  /**
   * Class constructor.
   */
  constructor() {}

  /**
   * Create an email content for new
   * user account event.
   */
  createUserRegisteredEmail(
    {
      from,
      to,
      data
    }: {
      from: string;
      to: string[];
      data: {
        name: string;
        token: string;
      };
    },
    options: { locale: string } = {
      locale: "en"
    }
  ): IEmail {
    return this._renderTemplate(
      from,
      to,
      userRegisteredTemplate,
      data,
      options.locale
    );
  }

  /**
   * Render a template.
   */
  private _renderTemplate(
    from: string,
    to: string[],
    template: IEmailTemplate,
    data: any,
    locale: string
  ): IEmail {
    // get locale
    const foundLocalizedTemplate = template.locales.find(
      l => l.locale === locale
    );

    if (!foundLocalizedTemplate)
      throw new Error("Could not find locale for this template");

    // format body
    let formatted = foundLocalizedTemplate.format;
    for (let key in data) {
      formatted = formatted.replace(`\${${key}}`, data[key]);
    }

    return {
      from,
      to,
      subject: foundLocalizedTemplate.subject,
      html: "",
      text: formatted
    };
  }
}
