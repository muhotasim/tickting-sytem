import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { JobTypes } from 'src/utils/custome.datatypes';

interface QueueItem {
  jobType: JobTypes;
  data: { [key: string]: any };
}

@Injectable()
export class QueueService implements OnModuleInit {
  private isProcessing = false;
  private queue: QueueItem[] = [];

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly mailService: MailService,
  ) { }

  onModuleInit() {
    this.processQueue();
  }

  addJob(type: JobTypes, data: { [key: string]: any }) {
    this.queue.push({ jobType: type, data });
    if (!this.isProcessing) {
      this.isProcessing = true;
      this.eventEmitter.emit('event.job_added');
    }
  }

  @OnEvent('event.job_added')
  async processQueue() {
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, 10); // Process up to 10 jobs at a time
      await Promise.all(batch.map(job => this.processJob(job)));
    }
    this.isProcessing = false;
  }

  private async processJob(job: QueueItem) {
    try {
      switch (job.jobType) {
        case JobTypes.mail:
          await this.mailService.sendMail(job.data);
          break;
        default:
          throw new Error(`Unsupported job type: ${job.jobType}`);
      }
    } catch (error) {
      console.error(`Error processing job: ${error.message}`);
      // You may want to handle retries or logging differently for failed jobs
    }
  }
}
