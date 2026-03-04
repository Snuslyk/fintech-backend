import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'
import { ResponseStatus } from '../utils/response.util'
import { Response } from '../utils/response.util'
import { Response as Res } from 'express'
import { isArray } from 'class-validator'

@Catch()
export class ResponseFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Res>()

    if (exception instanceof HttpException) {
      const errRes = exception.getResponse() as Response

      if (isArray(errRes.message)) {
        const errors = errRes.message.reduce<Record<string, string>>(
          (acc, m) => {
            const key = m.split(' ')[0]
            acc[key] = m
            return acc
          },
          {}
        )

        res.status(exception.getStatus()).json({
          status: ResponseStatus.VALIDATION_ERROR,
          errors
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
  }
}
