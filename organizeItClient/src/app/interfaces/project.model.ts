import {User} from './user.model';
import {ProjectUser} from "./project-user";

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: User;
  members: ProjectUser[];
  maxTeamMembers: number;
  created?: string;
  modified?: string;
  // technologies: string[]; // TODO: introduce Technology type?
}
