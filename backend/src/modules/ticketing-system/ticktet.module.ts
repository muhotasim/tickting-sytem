import { Module } from "@nestjs/common";
import { UserService } from "../common/services/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "src/models/ticket.model";
import { CommonModule } from "../common/common.module";
import { TicketController } from "./controller/ticket.controller";

@Module({
    imports: [CommonModule,TypeOrmModule.forFeature([Ticket])],
    controllers: [TicketController],
    providers: [UserService]
})
export class TicketModule {

}