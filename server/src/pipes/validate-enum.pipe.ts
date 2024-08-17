import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ERRORCODES } from 'src/core/error/code';
import { ERRORMESSAGE } from 'src/core/error/message';

@Injectable()
export class ValidateEnumPipe<T> implements PipeTransform {
  constructor(private enumValues: T[]) {}
  transform(value: T) {
    if (!this.enumValues.includes(value)) {
      throw new BadRequestException({
        message: ERRORMESSAGE.REQUEST_INVALID_PARAM_VALUE,
        errorCode: ERRORCODES.REQUEST_INVALID_PARAM_VALUE,
      });
    }

    return value;
  }
}
