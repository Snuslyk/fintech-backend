import { IsNotEmpty, IsString } from 'class-validator'

export class UserDto {}

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой!' })
  @IsNotEmpty()
  name: string

  @IsString({ message: 'Пароль долен быть строкой!' })
  @IsNotEmpty()
  password: string
}

export class LoginDto {
  @IsString({ message: 'Имя должно быть строкой!' })
  @IsNotEmpty()
  name: string

  @IsString({ message: 'Пароль долен быть строкой!' })
  @IsNotEmpty()
  password: string
}
