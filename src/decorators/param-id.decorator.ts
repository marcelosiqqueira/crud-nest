import { createParamDecorator } from "@nestjs/common/decorators";
import { ExecutionContext } from "@nestjs/common/interfaces";

export const ParamId = createParamDecorator( (data: unknown, context: ExecutionContext) => {

    return Number(context.switchToHttp().getRequest().params.id);
});