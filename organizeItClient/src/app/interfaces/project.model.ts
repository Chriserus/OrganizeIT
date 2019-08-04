export interface Project {
  id: number;
  title: string;
  description: string;
  owner: string; // TODO: introduce User or something
  technologies: string[]; // TODO: introduce Technology type?
  maxTeamMembers: number;
  members: string[]; // same as above - User
}
