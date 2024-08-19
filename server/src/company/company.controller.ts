import { ITokenPayload } from 'src/auth/token-payload.interface';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompnayDTO } from './dtos/create.dto';
import { UpdateCompanyDTO } from './dtos/update.dto';
import { AuthInfor } from 'src/decorators/userinfor.deco';
import { EnumValidationPipe } from 'src/pipes/validate-enum.pipe';
import { MongoObjectIdValidationPipe } from 'src/pipes/validate-mongo-object-id.pipe';
import { ResponseMessage } from 'src/decorators/response-message.deco';
import { UserService } from 'src/user/user.service';
import { getSM } from 'src/utils/getSuccessMessage';

@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private u: UserService,
  ) {}

  @Post('/:userId')
  @ResponseMessage(getSM('company', 'created'))
  async createCompany(
    @Body() companyInfor: CreateCompnayDTO,
    @Param('userId', new MongoObjectIdValidationPipe()) userId: string,
    @AuthInfor() auth: ITokenPayload,
  ) {
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

  @Patch('/request-change/:companyId')
  @ResponseMessage(getSM('request', 'created'))
  async requestUpdate(
    @Body() companyInfor: UpdateCompanyDTO,
    @Param('companyId') companyId: string,
  ) {
    return await this.companyService.requestUpdate(companyId, companyInfor);
  }

  @Patch('/view-request/:companyId/:status')
  @ResponseMessage(getSM('request', 'reviewed'))
  async updateRequestHistory(
    @Param('companyId') companyId: string,
    @Param(
      'status',
      new EnumValidationPipe<string>([
        'pending',
        'reviewing',
        'rejected',
        'approved',
      ]),
    )
    status: string,
    @AuthInfor() auth: ITokenPayload,
  ) {
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
