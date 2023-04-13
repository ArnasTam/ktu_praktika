import { mapToUserDto } from '@/mappers/user.mapper';
import { CreateUserDto, UserDto } from '@dtos/users.dto';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@interfaces/users.interface';
import { isEmpty } from '@utils/util';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository()
class UserService extends Repository<UserEntity> {
  public async findAllUser(): Promise<UserDto[]> {
    return (await UserEntity.find()).map(user => mapToUserDto(user));
  }

  public async findUserById(userId: number): Promise<UserDto> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return mapToUserDto(findUser);
  }

  public async createIfNotExists(userData: CreateUserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userData.id } });
    if (findUser) return mapToUserDto(findUser);

    return mapToUserDto(await UserEntity.create({ ...userData }).save());
  }

  public async updateUser(userId: string, userData: CreateUserDto): Promise<UserDto> {
    if (isEmpty(userData)) throw new HttpException(400, 'userData is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.update(userId, { ...userData, id: userId });

    return mapToUserDto(await UserEntity.findOne({ where: { id: userId } }));
  }

  public async deleteUser(userId: string): Promise<UserDto> {
    if (isEmpty(userId)) throw new HttpException(400, 'UserId is empty');

    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.delete({ id: userId });
    return mapToUserDto(findUser);
  }
}

export default UserService;
