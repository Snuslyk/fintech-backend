import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from '../user/user.dto'
import type { Response, Request } from 'express'
import { Public } from '../../decorators/is-public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.register(dto, res)
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res)
  }

  @Public()
  @Get('refresh')
  refresh(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    return this.authService.refresh(res, req)
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout(res)
  }
}
