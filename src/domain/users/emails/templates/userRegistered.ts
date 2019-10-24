import { IEmailTemplate, EmailTemplateType } from "./IEmailTemplate";
import { dotenv } from "../../../../application/env";

export const userRegisteredTemplate: IEmailTemplate = {
  type: EmailTemplateType.userRegistered,
  locales: [
    {
      locale: "ro",
      format: `Bun venit, \${name},
Acesta este linkul pentru activarea contului tau.
${dotenv.hostname}/users/confirm/\${token}

Numai bine!`,
      subject: "Confirmare cont email"
    },
    {
      locale: "en",
      format: `Welcome, \${name},
Click on this link to confirm your account.
${dotenv.hostname}/users/confirm/\${token}

All the best!`,
      subject: "Confirm email account"
    }
  ]
};
