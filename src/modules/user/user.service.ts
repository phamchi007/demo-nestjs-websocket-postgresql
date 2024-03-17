import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { UserEntity } from './entity/user.entity';

import { userType } from '../../common/enum';

@Injectable()
export class UserService {
  private repository: Repository<UserEntity>;
  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(UserEntity);
  }

  async signUpWithNickName(nickname: string): Promise<UserEntity> {
    const username = nickname.replaceAll(' ', '');
    const dataInsert = {
      username: nickname,
      nickname: username,
      type: userType.GUEST,
    };

    const newEntity = this.repository.create(dataInsert);
    const userData = await this.repository.save(newEntity);

    return userData;
  }
}
