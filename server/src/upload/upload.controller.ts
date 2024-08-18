import { CloudinaryService } from './cloudinary/cloudianry.service';
import {
  Controller,
  Get,
  ParseFilePipe,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/public.deco';
import { fileValidators } from './multer/file-validator';
import { UploadService } from './upload.service';
import { Request } from 'express';

@Controller('upload')
export class UploadController {
  constructor(
    private uploadService: UploadService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post('/single')
  @Public()
  @UseInterceptors(FileInterceptor('hello'))
  async uploadSingle(
    @UploadedFile(new ParseFilePipe({ validators: fileValidators }))
    file: Express.Multer.File,
    @Req() request: Request,
  ) {
    /* Upload image */
    const folder = (request.headers?.folder ?? 'general') as string;
    const { public_id, secure_url, transformation_url } =
      await this.uploadService.uploadSingle(
        file.path,
        { folder },
        { width: 320, height: 320 },
      );

    /* Return data */
    return { public_id, secure_url, transformation_url };
  }

  @Get('/test')
  @Public()
  test() {
    return this.cloudinaryService.getTransformationUrl(
      'hello/gokbgunaeyjyson2wyzm',
      200,
      200,
    );
  }
}
