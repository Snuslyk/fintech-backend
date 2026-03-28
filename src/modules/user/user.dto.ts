import { IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UserDto {}

export class RegisterDto {
  @ApiProperty({
    description: 'User name (used as login identifier)',
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'User password',
    example: 'strongPassword123',
    minLength: 6,
  })
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string
}

export class LoginDto {
  @ApiProperty({
    description: 'User name (login)',
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'User password',
    example: 'strongPassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string
}
