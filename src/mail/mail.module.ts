import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { EmailConsumer } from './mail.processor';
import { MailService } from './mail.service';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'email',
      },
    ),
  ],
  providers: [MailService, EmailConsumer],
  exports: [MailService],
})
export class MailModule {}
