import { IsNotEmpty } from 'class-validator'

export class UserDto {}

export class RegisterDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  password: string
}

export class LoginDto {
  @IsNotEmpty()
  name: string

  @IsNotEmpty()
  password: string
}
