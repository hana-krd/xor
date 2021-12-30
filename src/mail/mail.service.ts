import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    async sendOtp(otp: string, receiver: string) {
        //TODO implement send mail
    }
}
