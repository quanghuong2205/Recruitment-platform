import { Public } from 'src/decorators/public.deco';
import { UserService } from './user.service';
import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Public()
  @Get()
  getUser() {
    return 'hello';
  }
}
