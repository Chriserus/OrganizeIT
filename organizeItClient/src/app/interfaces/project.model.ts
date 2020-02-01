import {User} from './user.model';
import {ProjectUser} from "./project-user";

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  owner: User;
  members: ProjectUser[];
  maxMembers: number;
  verified: boolean;
  created?: string;
  modified?: string;
  // technologies: string[]; // TODO: introduce Technology type?
}
