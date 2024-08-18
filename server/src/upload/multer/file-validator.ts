import { FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';

export const fileValidators = [
  new MaxFileSizeValidator({
    maxSize: 1024 * 1024,
    message: (maxSize) => `Max file size: ${maxSize}`,
  }),

  new FileTypeValidator({
    fileType: /jpeg|jpg|png/,
  }),
];
