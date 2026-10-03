import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers.authorization;
    const token = authorization?.trim().split(' ')[1] as string;

    const secret = this.configService.getOrThrow<string>('TOKEN_SECRET');
    try {
      jwt.verify(token, secret);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
