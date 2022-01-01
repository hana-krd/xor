import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('email')
export class EmailConsumer {
    @Process()
    async transcode(job: Job<unknown>) {
      //todo send mail to user using mailer
        console.log(job);
        
    }
}