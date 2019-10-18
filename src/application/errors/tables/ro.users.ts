import { IErrorTable } from "exceptional.js";

export const usersTable: IErrorTable = {
  namespace: "users",
  locale: "ro",
  errors: {
    0: "S-a intamplat ceva neprevazut :(",
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
    7: "",
    8: "",
    9: "",
    10: "Nu am gasit niciun utilizator cu acest email ${email}.",
    11: "Ai gresit parola.",
    12: "Adresa de email ${email} este deja folosita de alt utilizator.",
    13: "Nu am gasit niciun utilizator cu acest id ${id}."
  }
};
