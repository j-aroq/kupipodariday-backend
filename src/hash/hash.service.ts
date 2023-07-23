import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class HashService {
  async getHashAsync(password: string): Promise<string> {
    const salt = await genSalt();
    return await hash(password, salt);
  }

  async isVerifiedAsync(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await compare(password, passwordHash);
  }
}
