import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  middleName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  family: string;

  avatar: string;

  @IsString()
  @IsMobilePhone()
  mobile?: string;

  email: string;

  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(200)
  nationalCode: string;

  @IsNumber()
  income: number;
}
