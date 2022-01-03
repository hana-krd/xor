import {
  IsMobilePhone,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  @IsOptional()
  name: string;

  middleName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(200)
  @IsOptional()
  family: string;

  avatar: string;

  @IsString()
  @IsMobilePhone()
  @IsOptional()
  mobile?: string;

  email: string;

  @IsNotEmpty()
  @IsOptional()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(200)
  @IsOptional()
  nationalCode: string;

  @IsNumber()
  @IsOptional()
  income: number;
}
