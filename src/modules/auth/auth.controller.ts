import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from '../user/user.dto'
import type { Response, Request } from 'express'
import { Public } from '../../decorators/is-public.decorator'
import {
  ApiBody, ApiConflictResponse,
  ApiCookieAuth, ApiNotFoundResponse, ApiOkResponse, ApiUnauthorizedResponse
} from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: "User created",
    schema: {
      example: {
        status: "success",
        data: {
          access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImlhdCI6MTc3NDY5ODcwMCwiZXhwIjoxNzc0NzA1OTAwfQ.N5NmrRBolsWxXylf1_GWeZqbvoqtSMhGZhitFnllACY"
        }
      }
    }
  })
  @ApiConflictResponse({
    description: 'User already exists!'
  })
  @Public()
  @Post('register')
  @ApiBody({ type: RegisterDto })
  register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res)
  }

  @ApiOkResponse({
    description: "User created",
    schema: {
      example: {
        status: "success",
        data: {
          access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImlhdCI6MTc3NDY5ODcwMCwiZXhwIjoxNzc0NzA1OTAwfQ.N5NmrRBolsWxXylf1_GWeZqbvoqtSMhGZhitFnllACY"
        }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'User not found!'
  })
  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res)
  }

  @ApiOkResponse({
    description: "User created",
    schema: {
      example: {
        status: "success",
        data: {
          access: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImlhdCI6MTc3NDY5ODcwMCwiZXhwIjoxNzc0NzA1OTAwfQ.N5NmrRBolsWxXylf1_GWeZqbvoqtSMhGZhitFnllACY"
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token'
  })
  @ApiNotFoundResponse({
    description: 'User not found!'
  })
  @Public()
  @Get('refresh')
  @ApiCookieAuth('refreshToken')
  refresh(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    return this.authService.refresh(res, req)
  }

  @ApiOkResponse({
    description: "User created",
    schema: {
      example: {
        status: "success"
      }
    }
  })
  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout(res)
  }
}
