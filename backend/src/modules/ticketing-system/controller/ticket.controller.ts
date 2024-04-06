import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { TicketService } from "../service/ticket.service";
import { User, errorResponse, successResponse } from "src/utils/common.functions";
import { GlobalService } from "src/modules/common/services/global.service";
import messagesConst from "src/utils/message-const.message";
import { CreateTicketDTO } from "../dto/create-ticket.dto";
import { TicketStatus } from "src/utils/custome.datatypes";

@Controller('tickets')
export class TicketController{
    constructor(private readonly ticketService: TicketService, private readonly globalService:GlobalService){}

    @Get()
    async index(@User() userInfo, @Query() query:any = {}, @Query('page') page: number, @Query('perPage') perPage: number){
        try {
            const gridData = this.globalService.getGlobalData('tickets');
            delete query.page;
            delete query.perPage;

            const data = await this.ticketService.getTickets(page, perPage)
            return successResponse(data, messagesConst['en'].controller.tickets.index, gridData);
        } catch (e) {
            return errorResponse(e);
        }
    }
    @Post()
    async submitTicket(@User() userInfo, @Body() body: CreateTicketDTO){
        try {
            const gridData = this.globalService.getGlobalData('tickets');
            const ticketData:any = {...body};
            ticketData.status = TicketStatus.open;
            ticketData.submission_date = new Date();
            ticketData.submited_by = userInfo.id;
            const ticket = await this.ticketService.submitTicket(ticketData);
            return successResponse(ticket, messagesConst['en'].controller.tickets.index, gridData);
        } catch (e) {
            return errorResponse(e);
        }
    }
    
}