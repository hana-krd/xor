import {
    IsMobilePhone,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';
import { isValidObjectId } from 'mongoose';

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

    @IsNotEmpty()
    @IsMobilePhone()
    mobile: string;

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
