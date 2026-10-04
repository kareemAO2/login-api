import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail({}, { message: 'Wrong email format' })
  @IsString()
  email: string;

  @MinLength(6)
  password: string;
  @MinLength(6)
  confirmPassword: string;
}
