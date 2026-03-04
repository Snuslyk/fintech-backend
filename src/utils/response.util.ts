export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  VALIDATION_ERROR = 'validation_error'
}

export interface Response {
  message: string | string[]
  error: string
  statusCode: number
}
