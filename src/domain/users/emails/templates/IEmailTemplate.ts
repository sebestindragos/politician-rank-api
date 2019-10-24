export enum EmailTemplateType {
  userRegistered
}

export interface IEmailLocale {
  locale: "ro" | "en";
  format: string;
  subject: string;
}

export interface IEmailTemplate {
  type: EmailTemplateType;
  locales: IEmailLocale[];
}
