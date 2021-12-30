import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { use } from 'passport';
import { User } from '../../database/schemas/user.schema';
import { Roles } from '../../static/enum/role.enum';
import { UserRolesService } from '../../user-roles/user-roles.service';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRolesService: UserRolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler());

    if (!roles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const charityId = request.body!.charityId;
    return this.matchRoles(roles, user, charityId);
  }

  async matchRoles(
    roles: Roles[],
    user: User,
    charityId: string,
  ): Promise<boolean> {
    
    const userRoles = await this.userRolesService.getUserRoles(charityId, user);

    if (!userRoles || !userRoles.roles) {
      return false;
    }

    var hasRole = false;

    roles.forEach((role) => {
      if (userRoles.roles.indexOf(role) >= 0) {
        hasRole = true;
      }
    });

    return hasRole;
  }
}
