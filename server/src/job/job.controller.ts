import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDTO } from './dtos/create.dto';
import { AuthInfor } from 'src/decorators/userinfor.deco';
import { ITokenPayload } from 'src/auth/token-payload.interface';
import { MongoObjectIdValidationPipe } from 'src/pipes/validate-mongo-object-id.pipe';
import { EnumValidationPipe } from 'src/pipes/validate-enum.pipe';
import { UpdateJobDTO } from './dtos/update.dto';

@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @Get('/:jobId')
  async getJob(@Param('jobId') jobId: string) {
    return await this.jobService.getJob(jobId);
  }

  @Get('')
  async getJobs() {}

  @Post('/:companyId')
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
  async draftJob(
    @Param('jobId', new MongoObjectIdValidationPipe()) jobId: string,
  ) {
    return await this.jobService.draftJob(jobId);
  }

  @Post('/public/:jobId')
  async publicJob(
    @Param('jobId', new MongoObjectIdValidationPipe()) jobId: string,
  ) {
    return await this.jobService.publicJob(jobId);
  }

  @Patch('/:jobId/status/:status')
  async updateJobStatus(
    @Param('jobId', new MongoObjectIdValidationPipe()) jobId: string,
    @Param(
      'status',
      new EnumValidationPipe(['reviewing', 'approved', 'rejected']),
    )
    status: string,
  ) {
    return await this.jobService.updateJobStatus(jobId, status);
  }

  @Put('/request-change/:jobId')
  async requestUpdate(
    @Param('jobId', new MongoObjectIdValidationPipe()) jobId: string,
    @Body() jobInfor: UpdateJobDTO,
  ) {
    return await this.jobService.requestUpdate(jobId, jobInfor);
  }

  @Patch('/view-request/:jobId/:status')
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
