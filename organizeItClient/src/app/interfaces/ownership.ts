import {Project} from "./project.model";
import {User} from "./user.model";

export interface Ownership {
  project: Project;
  user: User;
  created?: string;
  modified?: string;
}
