import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { BaseCRUDService } from 'src/core/base/crudservice.base';
import { Company } from './schemas/company.schema';
import { CreateCompnayDTO } from './dtos/create.dto';
import { UpdateCompanyDTO } from './dtos/update.dto';
import { CompanyRepository } from './repositories/company.repo';
import { ERRORMESSAGE } from 'src/core/error/message';
import { ERRORCODES } from 'src/core/error/code';
import { createObjectId } from 'src/utils/mongoose/createObjectId';
import { UserService } from 'src/user/user.service';

@Injectable()
export class CompanyService extends BaseCRUDService<
  Company,
  CreateCompnayDTO,
  UpdateCompanyDTO
> {
  constructor(
    private companyRepo: CompanyRepository,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    super(companyRepo, 'company servies');
  }

  async createCompany(
    userId: string,
    companyInfor: CreateCompnayDTO,
    createdBy: Record<string, any>,
  ) {
    const { email, phone } = companyInfor;

    /* Valdate email */
    let isExisted = await this.validateEmail(email);
    if (isExisted) {
      throw new BadRequestException({
        message: ERRORMESSAGE.COMPANY_EMAIL_ALREADY_USED,
        errorCode: ERRORCODES.COMPANY_EMAIL_ALREADY_USED,
      });
    }

    /* Valdate phone */
    isExisted = await this.validatePhone(phone);
    if (isExisted) {
      throw new BadRequestException({
        message: ERRORMESSAGE.COMPANY_PHONE_ALREADY_USED,
        errorCode: ERRORCODES.COMPANY_PHONE_ALREADY_USED,
      });
    }

    /* Generate text image url */

    /* Create company */
    const newCompany = await super.create({
      ...companyInfor,
      created_by: createdBy,
    } as any);

    /* Update user company */
    await this.userService.updateUserCompany(userId, {
      _id: newCompany['_id'],
      email,
    });

    /* Return data */
    return newCompany;
  }

  async requestUpdate(companyId: string, companyInfor: UpdateCompanyDTO) {
    /* Valdate email */
    if (companyInfor?.email) {
      const isExisted = await this.companyRepo.findOneExcludingId(companyId, {
        email: companyInfor.email,
      });
      if (isExisted) {
        throw new BadRequestException({
          message: ERRORMESSAGE.COMPANY_EMAIL_ALREADY_USED,
          errorCode: ERRORCODES.COMPANY_EMAIL_ALREADY_USED,
        });
      }
    }

    /* Valdate phone */
    if (companyInfor?.phone) {
      const isExisted = await this.companyRepo.findOneExcludingId(companyId, {
        phone: companyInfor.phone,
      });
      if (isExisted) {
        throw new BadRequestException({
          message: ERRORMESSAGE.COMPANY_PHONE_ALREADY_USED,
          errorCode: ERRORCODES.COMPANY_PHONE_ALREADY_USED,
        });
      }
    }

    /* Save request for change */
    const updatedCompany = await this.updateOne(
      { _id: createObjectId(companyId) },
      { request_for_change: companyInfor } as any,
    );

    /* Return data */
    return updatedCompany;
  }

  async updateRequestHistory(
    companyId: string,
    status: string,
    updatedBy: Record<string, any>,
  ) {
    /* validate company */
    const company = await this.validateCompany(companyId);

    /* Get request for change */
    const requestForChange = company.request_for_change;

    /* Handle request */
    const updatedCompany = await this.companyRepo.updateRequestForChange(
      status,
      companyId,
      requestForChange,
      updatedBy,
    );

    /* Return data */
    return updatedCompany;
  }

  async updateCompany(
    companyId: string,
    companyInfor: UpdateCompanyDTO,
    updatedBy: Record<string, any>,
  ) {
    /* validate company */
    await this.validateCompany(companyId);

    /* Update company */
    const updatedCompany = await this.companyRepo.updateOneById(companyId, {
      ...companyInfor,
      updated_by: updatedBy,
    } as any);

    /* Return data */
    return updatedCompany;
  }

  async validateEmail(email: string): Promise<boolean> {
    const user = await this.companyRepo.findCompanyByEmail(email);
    return !!user;
  }

  async validatePhone(phone: string): Promise<boolean> {
    const user = await this.companyRepo.findCompanyByPhone(phone);
    return !!user;
  }

  async validateCompany(companyId: string): Promise<Company> {
    /* Find company */
    const company = await this.findOne({ _id: createObjectId(companyId) });

    if (!company) {
      throw new BadRequestException({
        message: ERRORMESSAGE.COMPANY_NOT_FOUND,
        errorCode: ERRORCODES.COMPANY_NOT_FOUND,
      });
    }

    /* Return company */
    return company;
  }
}
