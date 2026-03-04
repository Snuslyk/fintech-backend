import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request, Response } from 'express'
import { isDev } from '../../utils/is-dev.util'
import { Payload } from './interfaces/interface.payload'
import ms, { StringValue } from 'ms'
import { LoginDto, RegisterDto } from '../user/user.dto'
import { UserService } from '../user/user.service'
import { password } from 'bun'

@Injectable()
export class AuthService {
  private readonly COOKIE_DOMAIN: string
  private readonly JWT_REFRESH_TTL: StringValue
  private readonly JWT_ACCESS_TTL: StringValue

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {
    this.COOKIE_DOMAIN = configService.getOrThrow('COOKIE_DOMAIN')
    this.JWT_REFRESH_TTL = configService.getOrThrow('JWT_REFRESH_TTL')
    this.JWT_ACCESS_TTL = configService.getOrThrow('JWT_ACCESS_TTL')
  }

  async register(dto: RegisterDto, res: Response) {
    const user = await this.userService.register(dto)
    const payload = { id: user.id }

    return this.auth(res, payload)
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.userService.findForLogin(dto)
    const payload = { id: user.id }

    const isPasswordValid = await password.verify(dto.password, user.password)

    if (!isPasswordValid) throw new NotFoundException('User not found!')

    return this.auth(res, payload)
  }

  async refresh(res: Response, req: Request) {
    const refresh: string = req.cookies['refreshToken'] as string
    let payload: Payload
    try {
      payload = this.jwtService.verify<Payload>(refresh)
    } catch {
      throw new UnauthorizedException('Invalid refresh token')
    }

    await this.userService.findForRefresh(payload.id)

    return this.auth(res, payload)
  }

  logout(res: Response) {
    this.setCookie(res, '', new Date(0))
  }

  private auth(res: Response, payload: Payload) {
    const { refresh, access } = this.sign(payload.id)

    const ttl = ms(this.JWT_REFRESH_TTL)
    this.setCookie(res, refresh, new Date(Date.now() + ttl))

    return { access }
  }

  private setCookie(res: Response, val: string, expires: Date) {
    res.cookie('refreshToken', val, {
      expires: expires,
      domain: this.COOKIE_DOMAIN,
      httpOnly: true,
      secure: !isDev(this.configService),
      sameSite: !isDev(this.configService) ? 'none' : 'lax'
    })
  }

  private sign(id: number) {
    const payload: Payload = { id }

    const refresh = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TTL
    })

    const access = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TTL
    })

    return { refresh, access }
  }

  async validate(payload: Payload) {
    return this.userService.findById(payload.id)
  }
}
