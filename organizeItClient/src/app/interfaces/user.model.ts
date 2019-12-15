import {Role} from "./role";
import {ShirtSize} from "./shirt-size";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: Role[];
  shirtSize: ShirtSize;
  // shirtType: string;
}
