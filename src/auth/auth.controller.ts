import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { USER_ALREADY_EXISTS } from 'src/utils/constants/user';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  async signin(@Req() req): Promise<{
    access_token: string;
  }> {
    return this.authService.getJwtToken(req.user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const doesUserExist =
      (await this.usersService.findByEmail(createUserDto.email)) ||
      (await this.usersService.findByUsername(createUserDto.username));

    if (doesUserExist) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    const user = await this.usersService.create(createUserDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }
}
