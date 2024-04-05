import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/models/role.model";
import { User } from "src/models/user.model";
import { UserService } from "./services/user.service";
import { RoleService } from "./services/role.service";
import { UserController } from "./controllers/user.controller";
import { RoleController } from "./controllers/role.controller";
import { PermissionService } from "./services/permissions.service";
import { PermissionController } from "./controllers/permission.controller";
import { Permission } from "src/models/permissions.model";
import { Token } from "src/models/token.model";
import { TokenService } from "./services/token.service";
import { ScheduleCleanUpService } from "./services/schedule-cleanup.schedule";
import { ScheduleModule } from "@nestjs/schedule";
import { JwtModule } from "@nestjs/jwt";
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from "./services/mail.service";
import { QueueService } from "./services/queue.service";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { NotificationController } from "./controllers/notification.controller";
import { NotificationService } from "./services/notification.service";
import { Notification } from "src/models/notification.model";
import { FilterGrid } from "src/models/grid.model";
import { GlobalService } from "./services/global.service";
import { EventsController } from "./controllers/events.controller";

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                port: Number(process.env.MAIL_PORT),
                secure: process.env.MAIL_SECURE == 'TRUE' ? true : false,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                },
                authMethod: process.env.MAIL_AUTH_METHOD
            },
            defaults: {
                from: '"nest-modules" <modules@nestjs.com>',
            },
            template: {
                dir: __dirname + '../../../../templates/mail',
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        TypeOrmModule.forFeature([User, Role, Permission, Token, Notification, FilterGrid]),
        ScheduleModule.forRoot(),
        JwtModule
    ],
    controllers: [UserController, RoleController, PermissionController, NotificationController, EventsController],
    providers: [UserService, RoleService, PermissionService, TokenService, ScheduleCleanUpService, MailService, QueueService, NotificationService, GlobalService],
    exports: [UserService, RoleService, PermissionService, TokenService, MailService, QueueService, NotificationService, GlobalService]
})
export class CommonModule { }