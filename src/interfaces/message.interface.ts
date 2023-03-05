import { User } from '@interfaces/users.interface';

export interface Message {
  id: number;
  content: string;
  from: User;
  to: User;
}
