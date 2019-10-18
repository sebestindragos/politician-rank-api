export interface IUser {
  id: number;
  email: string;
  password?: string;
  firstname: string;
  lastname?: string;
  active: 0 | 1;
}
