import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryFactory = {
  provide: 'CLOUDINARY',
  useFactory: (configService: ConfigService) => {
    /* Get config */
    const apiKey = configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = configService.get<string>('CLOUDINARY_SECRET_KEY');
    const cloudName = configService.get<string>('CLOUDINARY_NAME');

    /* Return config */
    return cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  },
  inject: [ConfigService],
};
