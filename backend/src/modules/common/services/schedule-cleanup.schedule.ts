import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService } from './token.service';

@Injectable()
export class ScheduleCleanUpService {
  constructor(private readonly _tokenService: TokenService) { }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    await this._tokenService.clearExpiredTokens();
  }
}