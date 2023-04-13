import { UserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';

// TODO: Move to class
export const mapToUserDto = (user: User): UserDto => {
  return { email: user.email, id: user.id, about: user.about ?? '', createdAt: user.createdAt };
};
