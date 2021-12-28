import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../database/schemas/user.schema";

export const GetUser = createParamDecorator(
    (data: any, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return (data ? user?.[data] : user);
    },
);