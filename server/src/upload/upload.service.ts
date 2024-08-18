import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudianry.service';
import { UploadApiOptions } from 'cloudinary';

interface ITranformation {
  width: number;
  height: number;
}

interface IMediaInfor {
  public_id: string;
  secure_url: string;
  transformation_url: string | null;
}

@Injectable()
export class UploadService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadSingle(
    path: string,
    options?: UploadApiOptions,
    transformOptions?: ITranformation,
  ): Promise<IMediaInfor> {
    /* Upload to cloudinary */
    const uploadResponse = await this.cloudinaryService.uploadOne(
      path,
      options,
    );
    const { public_id, secure_url } = uploadResponse;

    /* Get tranformed url */
    let transformation_url: string | null = null;
    if (transformOptions) {
      const { width, height } = transformOptions;
      transformation_url = this.cloudinaryService.getTransformationUrl(
        public_id,
        width,
        height,
      );
    }

    /* Return data */
    return {
      public_id,
      secure_url,
      transformation_url,
    };
  }
}
