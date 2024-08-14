import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { HttpExceptionFilter } from './exception-filters/http-exception-filter';
import { FormatResponseInterceptor } from './interceptors/format-response.interceptor';

@Module({
  imports: [
    /* Env */
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),

    /* Connect Mongodb */
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL', { infer: true }),
      }),
      inject: [ConfigService],
    }),

    /* Modules */
    AuthModule,
    UserModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },

    {
      provide: APP_INTERCEPTOR,
      useClass: FormatResponseInterceptor,
    },
  ],
})
export class AppModule {}
