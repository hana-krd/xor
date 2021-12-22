import { UserRoles } from "../../static/enum/user-role.enum";

export class UserFilterDto{

    name?: string;

    middleName?: string;

    family?: string;

    avatar?: string;

    mobile?: string;

    nationality?: string;

    nationalCode?: string;

    roles?: UserRoles[];

    income_greater_than?: number;

    income_lower_than?: number;
}