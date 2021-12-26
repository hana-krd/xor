import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../database/schemas/user.schema";

export const GetUser = createParamDecorator(
    (data: any, ctx: ExecutionContext): User => {
        const request = ctx.switchToHttp().getRequest();
        const user = {
            _id: '61c05ea66bf4b980e04b00d9'
        };
            //TODO uncomment request.user;
        return (data ? user?.[data] : user);
    },
);