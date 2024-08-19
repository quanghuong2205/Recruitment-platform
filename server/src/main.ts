import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /* Env */
  const configService = app.get(ConfigService);
  /* Middlewares */
  app.use(cookieParser());

  /* Global pipes */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  /* Listen */
  const port = <number>configService.get<number>('PORT', { infer: true });
  await app.listen(port, () => {
    console.log('Server is listening on the port::', port);
  });
}
bootstrap();
