import {User} from './user.model';

export interface Comment {
  id: number;
  content: string;
  announcement: boolean;
  author: User;
  created?: string;
  modified?: string;
}
