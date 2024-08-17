import { ITokenPayload } from 'src/auth/token-payload.interface';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.deco';
import { CompanyService } from './company.service';
import { CreateCompnayDTO } from './dtos/create.dto';
import { UpdateCompanyDTO } from './dtos/update.dto';
import { AuthInfor } from 'src/decorators/userinfor.deco';
import { EnumValidationPipe } from 'src/pipes/validate-enum.pipe';
import { MongoObjectIdValidationPipe } from 'src/pipes/validate-mongo-object-id.pipe';
import { ResponseMessage } from 'src/decorators/response-message.deco';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Public()
  @Post('/:userId')
  @ResponseMessage('hello success hello')
  async createCompany(
    @Body() companyInfor: CreateCompnayDTO,
    @Param('userId', new MongoObjectIdValidationPipe()) userId: string,
    @AuthInfor() auth: ITokenPayload,
  ) {
    return 1;
    const createdBy = {
      _id: auth._id,
      email: auth.email,
    };

    return await this.companyService.createCompany(
      userId,
      companyInfor,
      createdBy,
    );
  }

  @Public()
  @Patch('/view-request/:companyId/:status')
  async updateRequestHistory(
    @Body() companyInfor: UpdateCompanyDTO,
    @Param('companyId') companyId: string,
    @Param('status', new EnumValidationPipe<string>(['rejected', 'approved']))
    status: string,
    @AuthInfor() auth: ITokenPayload,
  ) {
    return companyId;
    const updatedBy = {
      _id: auth._id,
      email: auth.email,
    };
    return await this.companyService.updateRequestHistory(
      companyId,
      status,
      updatedBy,
    );
  }

  @Public()
  @Patch('/request-change/:companyId')
  async requestUpdate(
    @Body() companyInfor: UpdateCompanyDTO,
    @Param('companyId') companyId: string,
  ) {
    return await this.companyService.requestUpdate(companyId, companyInfor);
  }

  @Public()
  @Patch('/:companyId')
  async updateCompany(
    @Body() companyInfor: UpdateCompanyDTO,
    @Param('companyId') companyId: string,
    @AuthInfor() auth: ITokenPayload,
  ) {
    const updatedBy = {
      _id: auth._id,
      email: auth.email,
    };
    return await this.companyService.updateCompany(
      companyId,
      companyInfor,
      updatedBy,
    );
  }
}
