import {ProjectUser} from "./project-user";
import {Ownership} from "./ownership";

export interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  owners: Ownership[];
  members: ProjectUser[];
  maxMembers: number;
  verified: boolean;
  confirmed: boolean;
  created?: string;
  modified?: string;
}
