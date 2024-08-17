import { BaseRepository } from 'src/core/base/repository.base';
import { Company, RequestForChange } from '../schemas/company.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createObjectId } from 'src/utils/mongoose/createObjectId';

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
    const history = {
      data: requestForChange,
      viewedBy: updatedBy,
    };
    requestForChange.status = status;
    delete requestForChange['_id'];

    if (status === 'rejected') {
      return await this.repo.findOneAndUpdate(
        { _id: createObjectId(companyId) },
        {
          $push: { requestHistory: history },
          $set: { requestForChange: null },
        } as any,

        { new: true },
      );
    }

    if (status === 'approved') {
      return await this.repo.findOneAndUpdate(
        { _id: createObjectId(companyId) },
        {
          $push: { requestHistory: history },
          $set: { ...requestForChange, requestForChange: null },
        } as any,

        { new: true },
      );
    }
  }
}
