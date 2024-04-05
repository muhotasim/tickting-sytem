import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { GlobalService } from './modules/common/services/global.service'
@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    AuthModule,
    CommonModule
  ],
  providers: [
  ],
})

export class AppModule implements OnModuleInit{ 
  constructor(private readonly globalService: GlobalService) {}
  async onModuleInit() {
    const data = await this.globalService.getGrid();
    this.globalService.setGlobalData(data);
  }


}

