import { createParamDecorator } from '@nestjs/common'
import { User } from '../../generated/prisma/client'
import { Request } from 'express'

export const Authorized = createParamDecorator((data, context) => {
  const ctx = context.switchToHttp()
  const req: Request = ctx.getRequest()
  const user: User = req.user as User
  const { password, ...rest } = user

  return rest
})