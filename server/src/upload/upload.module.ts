import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterConfigService } from './multer.config-options';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const basedPath = configService.get<string>('UPLOAD_BASED_PATH');
        return new MulterConfigService(basedPath).createMulterOptions();
      },
      inject: [ConfigService],
    }),

    ConfigModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, ConfigService],
})
export class UploadModule {}
