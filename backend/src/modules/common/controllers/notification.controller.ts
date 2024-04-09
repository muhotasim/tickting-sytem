import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthorizationGuard } from "src/guards/authorization.guard";
import { User, errorResponse, successResponse } from "src/utils/common.functions";
import messagesConst from "src/utils/message-const.message";
import { NotificationService } from "../services/notification.service";
import { NotificationStatus } from "src/utils/custome.datatypes";
import { GlobalService } from "src/modules/common/services/global.service";
@ApiTags('Notification')
@UseGuards(AuthorizationGuard)
@Controller('notifications')
@ApiBearerAuth()
export class NotificationController {
    constructor(private readonly _notificationService: NotificationService, private readonly globalService: GlobalService) { }
    @Get()
    async index(@User() userInfo, @Query() query:any = {}, @Query('page') page: number, @Query('perPage') perPage: number) {
        try {
            const gridData = this.globalService.getGlobalData('notifications');
            delete query.page;
            delete query.perPage;
            const data = await this._notificationService.findAndCount(page, perPage,gridData, {...query, user_id: userInfo.id})
            return successResponse(data, messagesConst['en'].controller.notification.index, gridData);
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Patch('/mark-read')
    async markAsRead(@Body('notificationIDs') ids: number[]){
        try{
            await this._notificationService.markAsRead(ids)
            return successResponse({}, messagesConst['en'].controller.notification.update)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Post()
    async createNotification(@User() userInfo, @Body() body){
        try{
            const data = await this._notificationService.createBatchNotification([body])
            return successResponse(data, messagesConst['en'].controller.notification.create)
        } catch (e) {
            return errorResponse(e);
        }
    }

}