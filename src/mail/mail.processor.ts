//import { MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SendEmailDto } from './dto/send-email.dto';
import * as nodemailer from 'nodemailer';

@Processor('email')
export class EmailConsumer {
   mailer;
  constructor(
    //private mailerService: MailerService
  ) { 
  }
  
    @Process()
    async transcode(job: Job<SendEmailDto>) {
      const data = job.data;
      
      /*todo implement mailer 
      await this.mailerService.sendMail({
        to: data.receiverEmail,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: data.subject,
         template: './otp', // `.hbs` extension is appended automatically
        context: { // ✏️ filling curly brackets with content
          name: data.message
        },
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      }); */

        console.log(job);
        
    }
}