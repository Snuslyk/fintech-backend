import { Controller, Get } from '@nestjs/common'
import { UserService } from './user.service'
import { Authorized } from '../../decorators/authorized.decorator'
import type { User } from '../../../generated/prisma/client'
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    description: "User created",
    schema: {
      example: {
        status: "success",
        data: {
          id: 21,
          name: "user"
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized'
  })
  @Get()
  getSelf(@Authorized() user: User) {
    return user
  }
}
