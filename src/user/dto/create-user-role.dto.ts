import { OrganType } from "../../static/enum/organ-type.enum";
import { Roles } from "../../static/enum/role.enum";

export class UserRoleDto{
    user: string;
    organ: string;
    organType: OrganType;
    roles: Roles[];
}