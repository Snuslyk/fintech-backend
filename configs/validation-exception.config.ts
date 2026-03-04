import { ValidationError } from 'class-validator'
import { HttpException, HttpStatus } from '@nestjs/common'

export const validationExceptionConfig = (errors: ValidationError[]) => {
  const message = errors.reduce<Record<string, string>>((acc, error) => {
    const { property, constraints } = error
    if (constraints)
      acc[property] = Object.values(constraints)[0]

    return acc
  }, {})
  return new HttpException(
    {
      message,
      error: 'BadRequest',
      statusCode: HttpStatus.BAD_REQUEST
    },
    HttpStatus.BAD_REQUEST
  )
}