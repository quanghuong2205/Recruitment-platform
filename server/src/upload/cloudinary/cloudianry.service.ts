import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {}

  async uploadOne(
    path: string,
    options?: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    try {
      return await cloudinary.uploader.upload(path, options);
    } catch (error) {
      console.log(error);
    }
  }

  getTransformationUrl(
    publicId: string,
    width: number,
    height: number,
  ): string {
    try {
      return cloudinary.url(publicId, {
        transformation: { width, height },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
