import { ValidationError } from 'class-validator'
import { HttpException, HttpStatus } from '@nestjs/common'

export const validationExceptionConfig = (errors: ValidationError[]) => {
  const message = errors.reduce<Record<string, string | string[]>>((acc, error) => {
    const { property, constraints } = error
    if (constraints) {
      const constraintValues = Object.values(constraints)
      if (constraintValues.length === 1) {
        acc[property] = constraintValues[0]
      } else {
        acc[property] = constraintValues
      }
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