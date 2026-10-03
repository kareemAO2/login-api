import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login-form.js';
import { RegisterDto } from './dto/register-form.js';
import jwt from 'jsonwebtoken';
import { User } from '../schemas/user.schema.js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOne(loginDto.username);
    if (loginDto.password !== user?.password) {
      throw new BadRequestException('Wrong password');
    }

    const secret = this.configService.get<string>('TOKEN_SECRET') as string;
    const token = jwt.sign(
      {
        username: user.username,
        email: user.email,
      },
      secret,
      { expiresIn: '1h' },
    );
    return { user, token };
  }
  async register(registerDto: RegisterDto) {
    if (registerDto.password !== registerDto.confirmPassword) {
      throw new ForbiddenException("Confirm password doesn't match password");
    }
    const user = await this.usersService.create({
      username: registerDto.username,
      password: registerDto.password,
      email: registerDto.email,
    });
    return user;
  }
}
