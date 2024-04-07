import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/models/comment.model";
import { FilterGrid } from "src/models/grid.model";
import { TicketAttachments } from "src/models/ticket-attachment.model";
import { Ticket } from "src/models/ticket.model";
import { User } from "src/models/user.model";
import { NotificationService } from "src/modules/common/services/notification.service";
import { UserService } from "src/modules/common/services/user.service";
import { conditionWapper } from "src/utils/common.functions";
import { NotificationStatus, NotificationType, TicketInterface, TicketStatus } from "src/utils/custome.datatypes";
import { FindManyOptions, IsNull, Repository } from "typeorm";

@Injectable()
export class TicketService{
    constructor(
        @InjectRepository(Ticket) private readonly _m_Ticket:Repository<Ticket>,
        @InjectRepository(TicketAttachments) private readonly _m_TicketAttachments:Repository<TicketAttachments>,
        @InjectRepository(Comment) private readonly _m_Comment:Repository<Comment>,
        private readonly userService:UserService,
        private readonly notificationService: NotificationService

    ){}

    async dashboardData (){
        const summery = await this._m_Ticket
        .createQueryBuilder('ticket')
        .select("ticket.status")
        .addSelect("COUNT(ticket.id)", "total")
        .groupBy("ticket.status")
        .getRawMany()
        let data = {};
        for(let sD of summery){
            data[sD.ticket_status] = Number(sD.total)
        }
        return data;
    }

    async getById (id:number){ 
        return await this._m_Ticket.findOne({where: {id:id},
            relations: ['assigned_to','submited_by']})
    }
    async getTickets(page: number, perPage: number, grid: FilterGrid[],filterParams: { [key:string]: any }){
        const options: FindManyOptions<Ticket> = {
            take: perPage,
            skip: perPage * (page - 1),
            order: {id: 'DESC'},
            relations: ['assigned_to','submited_by']
        };
        
        delete filterParams.perPage
        delete filterParams.page
        if ( Object.keys(filterParams).length) {
            options.where = {};
            for(let key of Object.keys(filterParams)){
                let gridData = grid.find(g=>g.effect_on==key);
                if(filterParams[key]){
                    if(gridData){
                        options.where[key]=conditionWapper(gridData.condition,filterParams[key])
                    }else{
                        options.where[key]=filterParams[key];
                    }
                }
                
            }
        }
        const [data, total] = await this._m_Ticket
            .findAndCount(options);
        return { data, total };
    }
    async submitTicket(data: TicketInterface){
        const submitedUser:User = await this.userService.findById(data.submited_by);
        const ticket = await this._m_Ticket.create({
            title: data.title,
            details: data.details,
            priority: data.priority,
            status: data.status,
            submission_date: data.submission_date,
            submited_by: submitedUser,
        })
        const ticketData = await this._m_Ticket.save(ticket)
        const users = await this.userService.findAll();
        let notifications = [];
        for(let user of users){
            notifications.push({type: NotificationType.app,message: 'New Ticket Opened',timestamp:new Date(), status: NotificationStatus.unread, user: user, link: `/tickets-management/tickets/${ticket.id}` })
        }
        await this.notificationService.createBatchNotification(notifications);
        return ticketData;

    }
    async updateTicketStatus(ticket_id:number, status: TicketStatus){
        const ticket = await this._m_Ticket.findOne({where: {id: ticket_id}})
        ticket.status = status;
        return await this._m_Ticket.save(ticket)
    }
    async assignTicket({ticket_id, assigned_id}){
        
        const assignedUser:User = new User();
        assignedUser.id = assigned_id;
        const ticket = await this._m_Ticket.findOne({where: {id: ticket_id}})
        ticket.assigned_to = assignedUser;
        ticket.status = TicketStatus.inprocess;
        return await this._m_Ticket.save(ticket)
    }
    async makeComment({ticket_id, commented_by, comment, parent_id}:{ticket_id:number, commented_by:number, comment: string, parent_id:any}){
        const commentBy:User = await this.userService.findById(commented_by);
        const ticket = await this._m_Ticket.findOne({where: {id: ticket_id}})
        const crData:any = {
            comment: comment,
            ticket: ticket,
            user: commentBy,
        }
        if(parent_id){
            let parentComment = new Comment();
            parentComment.id = parent_id;
            crData.parent = parentComment;
        }
        const savedComment = await this._m_Comment.create(crData)
        return await this._m_Comment.save(savedComment)
    }
    async getComment({ticket_id, page = 1, perPage = 10}:{ticket_id:number, page:number, perPage:number}){
        const ticket = new Ticket()
        ticket.id = ticket_id;
        // const skip = perPage * (page - 1)
        // skip, take: perPage
        const comments =  await this._m_Comment.find({
            where: {ticket: ticket, parent: IsNull()},relations: ['comments','comments.user', 'user'],
             });
        return comments;
    }
}