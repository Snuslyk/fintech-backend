import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { JwtGuard } from './guards/jwt.guard'
import { ResponseInterceptor } from './interceptors/response.interceptor'
import { ResponseFilter } from './filters/response.filter'
import { ValidationExceptionConfig } from '../configs/validation-exception.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: ValidationExceptionConfig
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

  app.getHttpAdapter().get('/docs-json', (req, res) => {
    res.json(document)
  })

  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'default'
    })
  )

  const reflector = new Reflector()
  app.useGlobalGuards(new JwtGuard(reflector))

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
