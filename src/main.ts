import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { JwtGuard } from './guards/jwt.guard'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { ResponseFilter } from './filters/response.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true
    })
  )

  app.useGlobalFilters(new ResponseFilter())
  app.useGlobalInterceptors(new ResponseInterceptor())

  const config = new DocumentBuilder()
    .setTitle('Fintech')
    .setDescription('Fintech API documentation')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'default'
    })
  )

  const reflector = new Reflector()
  app.useGlobalGuards(new JwtGuard(reflector))

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
