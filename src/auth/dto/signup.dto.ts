import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class SignUpDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsMobilePhone()
    @IsOptional()
    mobile: string;

    @IsOptional()
    nationality: string;

    salt: string;

    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password is too weak' })
    password: string;
}