import {User} from './user.model';

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: User;
  created?: string;
  modified?: string;
  // technologies: string[]; // TODO: introduce Technology type?
  // maxTeamMembers: number;
  // members: User[];
}
