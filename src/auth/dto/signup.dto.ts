import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class SignUpDto extends CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsMobilePhone()
  @IsOptional()
  mobile: string;

  @IsOptional()
  nationality: string;

  salt: string;

  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;
}
