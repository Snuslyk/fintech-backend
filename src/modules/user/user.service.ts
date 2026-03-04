import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { LoginDto, RegisterDto } from './user.dto'
import { password } from 'bun'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    return this.prisma.user.create({
      data: {
        ...dto,
        password: await password.hash(dto.password)
      }
    })
  }

  async findForLogin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        name: dto.name
      },
      select: {
        id: true,
        password: true
      }
    })

    if (!user) throw new NotFoundException('User not found!')

    return user
  }

  async findForRefresh(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      },
      select: {
        id: true
      }
    })

    if (!user) throw new NotFoundException('User not found!')

    return user
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) throw new NotFoundException('User not found!')

    return user
  }
}
