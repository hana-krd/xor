import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllHttpExceptionsFilter, HttpValidationException, JsendInterceptor } from './common';
import { serverOptions } from './config/server.config';

async function bootstrap() {  
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validationError: {
        target: true,
        value: true,
      },
      exceptionFactory: (errors) => new HttpValidationException(errors),
    }),
  )

  // Add JSend exception filters
  const filter = app.get<AllHttpExceptionsFilter>(AllHttpExceptionsFilter)
  app.useGlobalFilters(filter)

  // Add JSend interceptors
  app.useGlobalInterceptors(new JsendInterceptor())

  app.enableCors(serverOptions.cors)
  
  await app.listen(serverOptions.port);
}
bootstrap();
