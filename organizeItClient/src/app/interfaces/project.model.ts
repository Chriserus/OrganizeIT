import {ProjectUser} from "./project-user";
import {Ownership} from "./ownership";
import {City} from "./city.enum";

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
  city: City;
  created?: string;
  modified?: string;
}
