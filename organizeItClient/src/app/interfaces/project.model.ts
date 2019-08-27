import {User} from './user.model';

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: User;
  // technologies: string[]; // TODO: introduce Technology type?
  // maxTeamMembers: number;
  // members: User[];
}
