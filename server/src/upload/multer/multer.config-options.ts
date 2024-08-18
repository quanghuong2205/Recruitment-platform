import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { Request } from 'express';

export class MulterConfigService implements MulterOptionsFactory {
  private basedPath: string;
  constructor(private base: string) {
    this.basedPath = base;
  }

  getAbsolutePath(folder: string) {
    /* Get root path */
    const rootPath = process.cwd();

    /* Return absolute path */
    return `${rootPath}/${this.basedPath}/${folder}`;
  }

  async validateExistance(folder: string) {
    const path = `${this.basedPath}/${folder}`;
    try {
      await fs.access(path);
    } catch (error) {
      console.log('error herer');
      /* Create the folder */
      await fs.mkdir(path, { recursive: true });
    }
  }

  getFileName(
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    /* Get file extention */
    const ext = path.extname(file.originalname || '');

    /* Unique suffix */
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

    /* File name */
    const fileName = `${file.fieldname}-${uniqueSuffix}.${ext}`;
    console.log('filename:: ', fileName);

    /* Run callback */
    cb(null, fileName);
  }

  async getDestination(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, destination: string) => void,
  ) {
    /* Get folder */
    const folder = (req.headers['folder'] ?? 'general') as string;

    /* Validate folder */
    await this.validateExistance(folder);

    /* Get absolute path */
    const absolutePath = this.getAbsolutePath(folder);

    /* Run callback */
    callback(null, absolutePath);
  }

  createMulterOptions(): Promise<MulterModuleOptions> | MulterModuleOptions {
    return {
      storage: multer.diskStorage({
        destination: async (req, file, cb) => {
          file['path'] = `${this.basedPath}/hello`;
          return await this.getDestination(req, file, cb);
        },
        filename: this.getFileName,
      }),
    };
  }
}
