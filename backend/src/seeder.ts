import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(__dirname, '..', (process.env.NODE_ENV == 'local' || process.env.NODE_ENV == 'development') ? '.development.env' : '.production.env') })
import { seeder } from "nestjs-seeder";
import { SeederService } from "./modules/seeder/services/seeder.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getDatabaseConfig } from "./config/database";
import { Token } from './models/token.model';
import { Role } from './models/role.model';
import { Permission } from './models/permissions.model';
import { User } from './models/user.model';


seeder({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    TypeOrmModule.forFeature([User, Token, Role, Permission])
  ],
}).run([SeederService]);