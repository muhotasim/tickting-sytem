import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards, Response, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthorizationGuard } from "src/guards/authorization.guard";
import messagesConst from "src/utils/message-const.message";
import { NotificationService } from "../services/notification.service";
import { NotificationStatus } from "src/utils/custome.datatypes";
import { GlobalService } from "src/modules/common/services/global.service";

@ApiTags('Events')
@Controller('events')
export class EventsController {
    private clients:any = {};

    generateClientId() {
        const timestamp = new Date().getTime(); // Get current timestamp
        const randomId = Math.random().toString(36).substr(2, 9); // Generate random string
        return `${timestamp}-${randomId}`; // Combine timestamp and random string
    }

    @Get()
    index(@Response() res, @Request() req){
        const clientId = this.generateClientId(); // Function to generate a unique client ID
        this.clients[clientId] = {
            write: res.write.bind(res),
            clientId: clientId
        };
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.write(`data: ${JSON.stringify({ message: 'connected' })}\n\n`);

        // Clean up when the client disconnects
        res.on('close', () => {
            delete this.clients[clientId];
        });
    }

    @Get('clients')
    clientList(){
        return Object.keys(this.clients);
    }

    @Post('send-message-to-client/:clientId')
    sendMessage(@Param('clientId') clientId:string, @Query('message') message:string){
        const client = this.clients[clientId];
        if (client) {
            client.write(`data: ${JSON.stringify({ message: message })}\n\n`);
        }
        return true;
    }
}