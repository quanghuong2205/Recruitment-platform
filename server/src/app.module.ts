import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

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

  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: AuthGuard,
  //   },
  // ],
})
export class AppModule {}
