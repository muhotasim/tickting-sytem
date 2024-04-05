import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}

export class ForgotPasswordDTO{
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ResetPasswordDTO{
  @ApiProperty()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsNotEmpty()
  new_password: string;

}

export class ChangePasswordDTO{
  @ApiProperty()
  @IsNotEmpty()
  current_password: string;

  @ApiProperty()
  @IsNotEmpty()
  new_password: string;

}