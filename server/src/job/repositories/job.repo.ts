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

    let modifiedProps = {};
    /* Reviewing + Pending */
    if (status === 'reviewing' || status === 'pending') {
      modifiedProps = { 'request_for_change.status': status };
    }

    /* Rejected */
    if (status === 'rejected') {
      modifiedProps = { request_for_change: null };
    }

    /* Approved */
    if (status === 'approved') {
      modifiedProps = { ...requestForChange, request_for_change: null };
    }

    /* Update and return */
    return await this.repo.findOneAndUpdate(
      { _id: createObjectId(jobId) },
      {
        $push: { request_history: history },
        $set: modifiedProps,
      } as any,

      { new: true },
    );
  }
}
