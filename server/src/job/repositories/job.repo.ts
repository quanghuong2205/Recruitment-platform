import { BaseRepository } from 'src/core/base/repository.base';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Job, RequestForChange } from '../schemas/job.schema';
import { createObjectId } from 'src/utils/mongoose/createObjectId';

@Injectable()
export class JobRepository extends BaseRepository<Job> {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {
    super(jobModel);
  }

  async updateRequestForChange(
    status: string,
    jobId: string,
    requestForChange: RequestForChange,
    updatedBy: Record<string, any>,
  ): Promise<Job> {
    /* Format history request field */
    const history = {
      data: requestForChange,
      viewed_by: updatedBy,
      created_at: new Date(),
    };
    requestForChange.status = status;
    delete requestForChange['_id'];

    if (status === 'reviewing') {
      return await this.repo.findOneAndUpdate(
        { _id: createObjectId(jobId) },
        {
          $push: { request_history: history },
          $set: { 'request_for_change.status': status },
        } as any,

        { new: true },
      );
    }

    if (status === 'rejected') {
      return await this.repo.findOneAndUpdate(
        { _id: createObjectId(jobId) },
        {
          $push: { request_history: history },
          $set: { request_for_change: null },
        } as any,

        { new: true },
      );
    }

    if (status === 'approved') {
      return await this.repo.findOneAndUpdate(
        { _id: createObjectId(jobId) },
        {
          $push: { request_history: history },
          $set: { ...requestForChange, request_for_change: null },
        } as any,

        { new: true },
      );
    }
  }
}
