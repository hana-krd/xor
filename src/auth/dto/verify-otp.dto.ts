import { IsNumberString } from "class-validator";

export class VerifyOtpDto {
    
    @IsNumberString()
    otp: string;
}