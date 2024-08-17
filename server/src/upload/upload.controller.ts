import { ConfigService } from '@nestjs/config';
import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/decorators/public.deco';
import { fileValidators } from './file-validator';

@Controller('upload')
export class UploadController {
  constructor(private configService: ConfigService) {}

  @Post('/single')
  @Public()
  @UseInterceptors(FileInterceptor('hello'))
  upload(
    @UploadedFile(new ParseFilePipe({ validators: fileValidators }))
    file: Express.Multer.File,
  ) {
    console.log(file);
    return {
      path: `${this.configService.get<string>('UPLOAD_BASED_PATH')}/${file.filename}`,
    };
  }
}
