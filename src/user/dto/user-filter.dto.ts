import { Roles } from '../../static/enum/role.enum';

export class UserFilterDto {
  charityId?: string;

  name?: string;

  middleName?: string;

  family?: string;

  avatar?: string;

  mobile?: string;

  nationality?: string;

  nationalCode?: string;

  roles?: Roles[];

  income_greater_than?: number;

  income_lower_than?: number;

  usersIn?: string[];
}
