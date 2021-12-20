import {
    IsMobilePhone,
    IsNotEmpty,
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

    @IsNotEmpty()
    @IsMobilePhone()
    mobile: string;

    nanionality: {
        name: string;

        language: string;

        currency: {
            iso: string;
        };
    };

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(200)
    nationalCode: string;
}
