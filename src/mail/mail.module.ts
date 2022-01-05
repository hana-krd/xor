//import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailConsumer } from './mail.processor';
import { MailService } from './mail.service';
import { mailOption } from '../config/mail.config';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'email',
      },
    ),
    //MailerModule.forRoot(mailOption),
  ],
  
  providers: [MailService, EmailConsumer],
  exports: [MailService],
})
export class MailModule {}
