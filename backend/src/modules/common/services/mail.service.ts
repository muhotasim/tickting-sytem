import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly _mailer: MailerService) { }

  sendMail(body: { to: string, from: string, subject: string, text?: string, html?: string, template?: string, context: { [key: string]: any } } | any) {
    return this._mailer.sendMail(body);
  }

}