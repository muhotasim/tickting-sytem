import { Module } from "@nestjs/common";
import { CommonModule } from "../common/common.module";
import { EventController } from "./controller/events.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        CommonModule,
        JwtModule
    ],
    controllers: [EventController],
    providers: [
    ]
})
export class EventModule{
    
}