import { ValidationError } from 'class-validator'
import { HttpException, HttpStatus } from '@nestjs/common'

export function ValidationExceptionConfig(errors: ValidationError[]) {
  const message = errors.reduce<Record<string, string | string[]>>((acc, error) => {
    const { property, constraints } = error
    if (constraints) {
      const values = Object.values(constraints)
      acc[property] = values.length === 1 ? values[0] : values
    }

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