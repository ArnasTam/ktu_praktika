import { UserEntity } from '@entities/users.entity';
import { DataStoredInToken } from '@interfaces/auth.interface';
import { Request } from 'express';
import { decode } from 'jsonwebtoken';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository()
class AuthService extends Repository<UserEntity> {
  public async getClaims(req: Request) {
    const token = req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null;
    if (!token) {
      return null;
    }

    const claims = (await decode(token)) as DataStoredInToken;

    return {
      tokenSubject: claims.sub,
    };
  }
}

export default AuthService;
