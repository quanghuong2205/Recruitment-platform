import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDTO } from './dtos/create.dto';
import { AuthInfor } from 'src/decorators/userinfor.deco';
import { ITokenPayload } from 'src/auth/token-payload.interface';
import { MongoObjectIdValidationPipe } from 'src/pipes/validate-mongo-object-id.pipe';
import { EnumValidationPipe } from 'src/pipes/validate-enum.pipe';
import { UpdateJobDTO } from './dtos/update.dto';
import { ResponseMessage } from 'src/decorators/response-message.deco';
import { getSM } from 'src/utils/getSuccessMessage';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('/many')
  async getJobs(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query() query: string,
  ) {
    /* Get users */
    const users = await this.jobService.findManyWithPopulate(
      query,
      +page,
      +limit,
      [],
      ['__v', 'request_history'],
      [{ path: 'company', selectedProps: ['logo_url', 'name', '_id'] }],
    );

    /* Return data */
    return {
      users,
    };
  }

  @Get('/:jobId')
  async getJob(@Param('jobId') jobId: string) {
    return await this.jobService.getJob(jobId);
  }

  @Post('/:companyId')
  @ResponseMessage(getSM('job', 'created'))
  async createJob(
    @Body() jobInfor: CreateJobDTO,
    @Param('companyId', new MongoObjectIdValidationPipe())
    companyId: string,
    @AuthInfor() auth: ITokenPayload,
  ) {
    const createdBy = {
      _id: auth._id,
      email: auth.email,
    };

    return await this.jobService.createJob(companyId, jobInfor, createdBy);
  }

  @Post('/draft/:jobId')
  @ResponseMessage(getSM('job', 'drafted'))
  async draftJob(
    @Param('jobId', new MongoObjectIdValidationPipe()) jobId: string,
  ) {
    return await this.jobService.draftJob(jobId);
  }

  @Post('/public/:jobId')
  @ResponseMessage(getSM('job', 'public'))
  async publicJob(
    @Param('jobId', new MongoObjectIdValidationPipe()) jobId: string,
  ) {
    return await this.jobService.publicJob(jobId);
  }

  @Patch('/:jobId/status/:status')
  @ResponseMessage(getSM('job status', 'updated'))
  async updateJobStatus(
    @Param('jobId', new MongoObjectIdValidationPipe()) jobId: string,
    @Param(
      'status',
      new EnumValidationPipe(['pending', 'reviewing', 'approved', 'rejected']),
    )
    status: string,
  ) {
    return await this.jobService.updateJobStatus(jobId, status);
  }

  @Put('/request-update/:jobId')
  @ResponseMessage(getSM('request for update', 'maded'))
  async requestUpdate(
    @Param('jobId', new MongoObjectIdValidationPipe()) jobId: string,
    @Body() jobInfor: UpdateJobDTO,
  ) {
    return await this.jobService.requestUpdate(jobId, jobInfor);
  }

  @Patch('/view-request/:jobId/:status')
  @ResponseMessage(getSM('request for update', 'viewed'))
  async updateRequestHistory(
    @Param('jobId') jobId: string,
    @Param(
      'status',
      new EnumValidationPipe<string>(['reviewing', 'rejected', 'approved']),
    )
    status: string,
    @AuthInfor() auth: ITokenPayload,
  ) {
    const updatedBy = {
      _id: auth._id,
      email: auth.email,
    };

    return await this.jobService.updateRequestHistory(jobId, status, updatedBy);
  }
}
