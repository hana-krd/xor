import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class SignUpDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsMobilePhone()
    mobile: string;
    nationality: string;

    salt: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @Matches(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
        { message: 'Password is too weak' })
    password: string;
}