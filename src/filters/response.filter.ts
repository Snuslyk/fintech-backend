import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException, HttpStatus, Logger
} from '@nestjs/common'
import { ResponseStatus } from '../utils/response.util'
import { Response } from '../utils/response.util'
import { Response as Res } from 'express'

@Catch()
export class ResponseFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(ResponseFilter.name)

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Res>()

    if (exception instanceof HttpException) {
      const errRes = exception.getResponse() as Response

      if (typeof errRes.message === 'object') {
        res.status(exception.getStatus()).json({
          status: ResponseStatus.VALIDATION_ERROR,
          errors: errRes.message
        })
        return
      }

      res.status(exception.getStatus()).json({
        status: ResponseStatus.ERROR,
        message: errRes.message,
        code: errRes.statusCode
      })
      return
    }

    this.logger.error(exception)

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: ResponseStatus.ERROR,
      message: 'Internal server error',
      code: HttpStatus.INTERNAL_SERVER_ERROR
    })
  }
}
