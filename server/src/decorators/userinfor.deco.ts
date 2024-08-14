import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const httpContext = ctx.switchToHttp();
    const request = httpContext.getRequest();
    return request.user;
  },
);
