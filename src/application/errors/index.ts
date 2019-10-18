// load application exceptional table of errors
import { registerTable, setLocale } from "exceptional.js";

import { defaultTable } from "./tables/ro.default";
import { usersTable } from "./tables/ro.users";

export function initErrorSubsystem(locale: string) {
  registerTable(defaultTable);
  registerTable(usersTable);

  setLocale(locale);
}
