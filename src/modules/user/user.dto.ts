import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UserDto {}

export class RegisterDto {
  @IsString({ message: 'Имя должно быть строкой!' })
  @IsEmail(undefined, { message: 'Имя должно быть в формате Email!' })
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
