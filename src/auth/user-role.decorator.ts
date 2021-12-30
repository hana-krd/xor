import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Roles } from '../static/enum/role.enum';

export const UserRoles = (...roles: Roles[]) => SetMetadata('roles', roles);

