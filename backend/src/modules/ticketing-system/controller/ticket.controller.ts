import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { TicketService } from "../service/ticket.service";
import { User, errorResponse, successResponse } from "src/utils/common.functions";
import { GlobalService } from "src/modules/common/services/global.service";
import messagesConst from "src/utils/message-const.message";
import { CreateTicketDTO } from "../dto/create-ticket.dto";
import { TicketStatus } from "src/utils/custome.datatypes";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthorizationGuard } from "src/guards/authorization.guard";
@ApiTags('Tickets')
@UseGuards(AuthorizationGuard)
@Controller('tickets')
@ApiBearerAuth()
export class TicketController {
    constructor(private readonly ticketService: TicketService, private readonly globalService: GlobalService) { }

    @Get('/dashboard')
    async dashboard(){
        try{

            const data =await this.ticketService.dashboardData()
            return successResponse(data, messagesConst['en'].controller.tickets.index);
        } catch (e) {
            return errorResponse(e);
        }
    }
    @Get()
    async index(@User() userInfo, @Query() query: any = {}, @Query('page') page: number, @Query('perPage') perPage: number) {
        try {
            const gridData = this.globalService.getGlobalData('tickets');
            delete query.page;
            delete query.perPage;

            const data = await this.ticketService.getTickets(page, perPage, gridData, query)
            return successResponse(data, messagesConst['en'].controller.tickets.index, gridData);
        } catch (e) {
            return errorResponse(e);
        }
    }
    @Post()
    async submitTicket(@User() userInfo, @Body() body: CreateTicketDTO) {
        try {
            const ticketData: any = { ...body };
            ticketData.status = TicketStatus.open;
            ticketData.submission_date = new Date();
            ticketData.submited_by = userInfo.id;
            const ticket = await this.ticketService.submitTicket(ticketData);
            return successResponse(ticket, messagesConst['en'].controller.tickets.index);
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Patch('assign/:id')
    async asyncTicket(@Param('id') id: number, @Body('assign_to') assign_to: number) {
        try {
            const data = await this.ticketService.assignTicket({ ticket_id: id, assigned_id: assign_to });
            return successResponse(data, "");
        } catch (e) {
            return errorResponse(e);
        }
    }

    
    @Post('/:id/resolve')
    async resolveTicket(@Param('id') id:number){
        try{
            const data = await this.ticketService.updateTicketStatus(id, TicketStatus.resolved);
            return successResponse(data, messagesConst['en'].controller.tickets.index);
        }catch (e) {
            return errorResponse(e);
        }
    }



    @Post('comment')
    async comment(@Body() body: { ticket_id: number, comment: string, parent_id: number }, @User() user) {
        try {
            const data = await this.ticketService.makeComment({ ticket_id: body.ticket_id, parent_id: body.parent_id, comment: body.comment, commented_by: user.id })
            return successResponse(data, "");

        } catch (e) {
            return errorResponse(e);
        }
    }

    
    @Get('/:id')
    async getById(@Param('id') id:number){ 
        try {
            const data = await this.ticketService.getById(id)
            return successResponse(data, "");

    } catch (e) {
        return errorResponse(e);
    }
    }

    @Get('comments/:ticket_id')
    async comments(@Query('page') page: number, @Query('perPage') perPage: number, @Param('ticket_id') ticket_id: number) {
        try {
            const data = await this.ticketService.getComment({
                ticket_id: ticket_id,
                page: page,
                perPage: perPage
            })
            return successResponse(data, "");
        } catch (e) {
            return errorResponse(e);
        }
    }

}