//import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailConsumer } from './mail.processor';
import { MailService } from './mail.service';
//import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'email',
      },
    ),
/*     MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      // or
      transport: {
        host: 'mail.emir.krd',
        secure: false,
        auth: {
          user: 'hi@emir.krd',
          pass: 'OO989l89V5Vll4',
        },
      },
      defaults: {
        from: '"No Reply" <hi@emir.krd>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }), */
  ],
  
  providers: [MailService, EmailConsumer],
  exports: [MailService],
})
export class MailModule {}
