import { Module } from "@nestjs/common";
import { UserService } from "../common/services/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "src/models/ticket.model";
import { CommonModule } from "../common/common.module";
import { TicketController } from "./controller/ticket.controller";
import { TicketService } from "./service/ticket.service";
import { TicketAttachments } from "src/models/ticket-attachment.model";
import { Comment } from "src/models/comment.model";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [CommonModule,TypeOrmModule.forFeature([Ticket, TicketAttachments, Comment]), JwtModule],
    controllers: [TicketController],
    providers: [TicketService]
})
export class TicketModule {

}