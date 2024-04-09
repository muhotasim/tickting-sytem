import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthorizationGuard } from "src/guards/authorization.guard";
import { GlobalService } from "src/modules/common/services/global.service";
import { User, errorResponse, successResponse } from "src/utils/common.functions";

@ApiTags('Events')
@UseGuards(AuthorizationGuard)
@Controller('events')
@ApiBearerAuth()
export class EventController{

    constructor(private readonly globalService: GlobalService){}
    @Get()
    event(@User() user){
        try{
            const data = {...this.globalService.getNotification(user.id)}
            console.log(data)
            if(data.notificationUpdate){
                this.globalService.updatedNotification(user.id, 'notificationUpdate');
            }
            if(data.ticketUpdate){
                this.globalService.updatedNotification(user.id, 'ticketUpdate');
            }
            return successResponse(data, "Notification Fetched successfully");
        }catch(e){
            return errorResponse(e)
        }
    }
}