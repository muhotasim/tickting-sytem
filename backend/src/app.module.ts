import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { GlobalService } from './modules/common/services/global.service'
import { TicketModule } from './modules/ticketing-system/ticktet.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
    CommonModule,
    TicketModule
  ],
  providers: [
  ],
})

export class AppModule implements OnModuleInit{ 
  constructor(private readonly globalService: GlobalService) {}
  async onModuleInit() {
    const data = (await this.globalService.getGrid()).map(d=>{
      d.options = d.options?JSON.parse(d.options):[]
      return d;
    });
    this.globalService.setGlobalData(data);
  }


}

