import { ConfigService } from '@nestjs/config'

export function isDev(configService: ConfigService) {
  return configService.getOrThrow('IS_DEV') === 'development'
}
