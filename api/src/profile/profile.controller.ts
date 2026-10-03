import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/jwt-auth.js';

@Controller('profile')
export class ProfileController {
  @UseGuards(AuthGuard)
  @Get()
  profile() {
    return 'Welcome home';
  }
}
