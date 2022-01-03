
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class MailService {
    constructor(
        @InjectQueue('email') private emailQueue: Queue,
    ){}

    async sendOtp(otp: string, receiver: string) {
        return this.sendEmail({
            receiverEmail: receiver,
            message: `Please user provided OTP to authenticate in XOR system, If its not from you ignore. Code is: ${otp}`,
            subject: 'One-Time-Password'
        });
    }

    async sendEmail(data: SendEmailDto) {
        const job = await this.emailQueue.add(data);
        return true;
    }
}
