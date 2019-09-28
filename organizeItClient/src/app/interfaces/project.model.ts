import {User} from './user.model';

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: User;
  created?: string;
  modified?: string;
  members: User[];
  maxTeamMembers: number;
  // technologies: string[]; // TODO: introduce Technology type?
}
