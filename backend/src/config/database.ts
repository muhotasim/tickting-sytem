import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Token } from "src/models/token.model";
import { Menu } from "src/models/menu.model";
import { Permission } from "src/models/permissions.model";
import { Role } from "src/models/role.model";
import { User } from "src/models/user.model";
import { Notification } from "src/models/notification.model";
import { FilterGrid } from "src/models/grid.model";
import { Ticket } from "src/models/ticket.model";
import { TicketAttachments } from "src/models/ticket-attachment.model";
import { Comment } from "src/models/comment.model";

export const getDatabaseConfig = ():TypeOrmModuleOptions =>{
    return {
        type: process.env.DB_TYPE=='mysql'?"mysql":'mariadb',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        entities: [ User, Role,  Permission, Token, Menu, Notification, FilterGrid, Ticket, TicketAttachments, Comment ],
        synchronize: true,
    }
}