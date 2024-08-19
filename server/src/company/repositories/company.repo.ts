import { BaseRepository } from 'src/core/base/repository.base';
import { Company, RequestForChange } from '../schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createObjectId } from 'src/utils/mongoose/createObjectId';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyRepository extends BaseRepository<Company> {
  constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {
    super(companyModel);
  }

  async findCompanyByEmail(email: string): Promise<Company> {
    return await this.findOne({ email });
  }

  async findCompanyByPhone(phone: string): Promise<Company> {
    return await this.findOne({ phone });
  }

  async updateRequestForChange(
    status: string,
    companyId: string,
    requestForChange: RequestForChange,
    updatedBy: Record<string, any>,
  ): Promise<Company> {
    /* Format history request field */
    requestForChange.status = status;
    delete requestForChange['_id'];
    const history = {
      data: requestForChange,
      viewed_by: updatedBy,
      created_at: new Date(),
    };

    let modifiedProps = {};
    /* Reviewing */
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
      { _id: createObjectId(companyId) },
      {
        $push: { request_history: history },
        $set: modifiedProps,
      } as any,

      { new: true },
    );
  }
}
