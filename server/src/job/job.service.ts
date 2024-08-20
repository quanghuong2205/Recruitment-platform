import { BadRequestException, Injectable } from '@nestjs/common';
import { Job } from './schemas/job.schema';
import { CreateJobDTO } from './dtos/create.dto';
import { UpdateJobDTO } from './dtos/update.dto';
import { BaseCRUDService } from 'src/core/base/crudservice.base';
import { JobRepository } from './repositories/job.repo';
import { WorkingTimeDTO } from './dtos/common.dto';
import { createObjectId } from 'src/utils/mongoose/createObjectId';
import { ERRORMESSAGE } from 'src/core/error/message';
import { ERRORCODES } from 'src/core/error/code';
import { CompanyService } from 'src/company/company.service';

@Injectable()
export class JobService extends BaseCRUDService<
  Job,
  CreateJobDTO,
  UpdateJobDTO
> {
  constructor(
    private jobRepo: JobRepository,
    private companyService: CompanyService,
  ) {
    super(jobRepo, 'job servies');
  }

  async getJob(jobId: string) {
    return await this.jobRepo.findOneByIdWithPopulate(
      jobId,
      [],
      ['__v', 'request_history'],
      {
        path: 'company',
        selectedProps: ['name', 'logo_url', 'size', 'address', '_id'],
      },
    );
  }

  async createJob(
    companyId: string,
    jobInfor: CreateJobDTO,
    createdBy: Record<string, any>,
  ) {
    const {
      start_date,
      end_date,
      min_salary,
      max_salary,
      experience: { min, max },
    } = jobInfor;
    /* Validate Company */
    await this.companyService.validateCompany(companyId);

    /* Validate Date */
    this.validateDate(start_date, end_date);

    /* Validate working time */
    this.validateWorkingTime(jobInfor.working_time);

    /* Validate salary */
    this.validateSalary(min_salary, max_salary);

    /* Validate Yoe */
    this.validateYoe(min, max);

    /* Create job */
    return await this.create({
      company: createObjectId(companyId),
      ...jobInfor,
      created_by: createdBy,
    } as any);
  }

  async draftJob(jobId: string) {
    return await this.jobRepo.updateOneById(jobId, {
      is_draft: true,
    } as any);
  }

  async publicJob(jobId: string) {
    return await this.jobRepo.updateOneById(jobId, {
      is_draft: false,
    } as any);
  }

  async updateJobStatus(jobId: string, status: string) {
    return this.jobRepo.updateOneById(jobId, { status });
  }

  async requestUpdate(jobId: string, jobInfor: UpdateJobDTO) {
    const {
      start_date,
      end_date,
      min_salary,
      max_salary,
      experience: { min, max },
    } = jobInfor;

    /* validate job */
    await this.validateJob(jobId);

    /* Validate Date */
    this.validateDate(start_date, end_date);

    /* Validate working time */
    this.validateWorkingTime(jobInfor.working_time);

    /* Validate salary */
    this.validateSalary(min_salary, max_salary);

    /* Validate Yoe */
    this.validateYoe(min, max);

    /* Save request for change */
    const updatedJob = await this.jobRepo.updateOneById(jobId, {
      request_for_change: jobInfor,
    } as any);

    /* Return data */
    return updatedJob;
  }

  async updateRequestHistory(
    jobId: string,
    status: string,
    updatedBy: Record<string, any>,
  ) {
    /* validate job */
    const job = await this.validateJob(jobId);

    /* Get request for change */
    const requestForChange = job.request_for_change;

    /* Check status (ex: has already been revewing status, but switch to reviewing again) */
    if (requestForChange.status === status) {
      throw new BadRequestException();
    }

    /* Handle request and update request history */
    const updatedCompany = await this.jobRepo.updateRequestForChange(
      status,
      jobId,
      requestForChange,
      updatedBy,
    );

    /* Return data */
    return updatedCompany;
  }

  private validateDate(startDate: string, endDate: string) {
    if (new Date(startDate).getTime() < Date.now()) {
      throw new BadRequestException({});
    }

    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      throw new BadRequestException({});
    }

    return true;
  }

  private validateWorkingTime(workingTime: WorkingTimeDTO[]) {
    for (let i = 0; i < workingTime.length; i++) {
      const { start_date, end_date } = workingTime[i];
      if (start_date > end_date) {
        throw new BadRequestException({});
      }
    }
  }

  private validateSalary(minSalary: number, maxSalary: number) {
    if (minSalary > maxSalary) {
      throw new BadRequestException({});
    }
    return true;
  }

  private validateYoe(minYoe: number, maxYoe: number) {
    if (minYoe > maxYoe) {
      throw new BadRequestException({});
    }
    return true;
  }

  async validateJob(jobId: string): Promise<Job> {
    /* Find company */
    const job = await this.findOne({ _id: createObjectId(jobId) });

    if (!job) {
      throw new BadRequestException({
        message: ERRORMESSAGE.DOCUMENT_NOT_FOUND,
        errorCode: ERRORCODES.DOCUMENT_NOT_FOUND,
      });
    }

    /* Return company */
    return job;
  }
}
