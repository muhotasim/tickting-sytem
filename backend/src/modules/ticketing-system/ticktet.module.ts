import { Module } from "@nestjs/common";
import { UserService } from "../common/services/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "src/models/ticket.model";
import { CommonModule } from "../common/common.module";

@Module({
    imports: [CommonModule,TypeOrmModule.forFeature([Ticket])],
    controllers: [],
    providers: [UserService]
})
export class TicketModule {

}