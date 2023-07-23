import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from 'src/hash/hash.service';
import { INVALID_LOGIN } from 'src/utils/constants/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  async getJwtToken(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(
    username: string,
    userPassword: string,
  ): Promise<User> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException(INVALID_LOGIN);
    }

    const isAuth = await this.hashService.isVerifiedAsync(
      userPassword,
      user.password,
    );

    if (!isAuth) {
      throw new UnauthorizedException(INVALID_LOGIN);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
