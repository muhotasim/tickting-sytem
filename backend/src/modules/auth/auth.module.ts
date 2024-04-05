import { Module } from "@nestjs/common";
import { AuthController } from "./controllers/auth.controller";
import { CommonModule } from "../common/common.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [CommonModule, JwtModule],
    controllers: [AuthController]
})
export class AuthModule{

}