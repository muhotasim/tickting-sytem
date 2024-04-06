import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "src/models/comment.model";
import { TicketAttachments } from "src/models/ticket-attachment.model";
import { Ticket } from "src/models/ticket.model";
import { User } from "src/models/user.model";
import { UserService } from "src/modules/common/services/user.service";
import { TicketInterface, TicketStatus } from "src/utils/custome.datatypes";
import { FindManyOptions, IsNull, Repository } from "typeorm";

@Injectable()
export class TicketService{
    constructor(
        @InjectRepository(Ticket) private readonly _m_Ticket:Repository<Ticket>,
        @InjectRepository(TicketAttachments) private readonly _m_TicketAttachments:Repository<TicketAttachments>,
        @InjectRepository(Comment) private readonly _m_Comment:Repository<Comment>,
        private readonly userService:UserService

    ){}

    async getById (id:number){
        return await this._m_Ticket.findOne({where: {id:id}})
    }
    async getTickets(page: number, perPage: number){
        const options: FindManyOptions<Ticket> = {
            take: perPage,
            skip: perPage * (page - 1),
        };
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
        return ticketData;

    }
    async updateTicketStatus(ticket_id:number, status: TicketStatus){
        const ticket = await this._m_Ticket.findOne({where: {id: ticket_id}})
        ticket.status = status;
        return await this._m_Ticket.save(ticket)
    }
    async assignTicket({ticket_id, assigned_id}){
        
        const assignedUser:User = await this.userService.findById(assigned_id);
        const ticket = await this._m_Ticket.findOne({where: {id: ticket_id}})
        ticket.assigned_to = assignedUser;
        return await this._m_Ticket.save(ticket)
    }
    async makeComment({ticket_id, commented_by, comment}){
        const commentBy:User = await this.userService.findById(commented_by);
        const ticket = await this._m_Ticket.findOne({where: {id: ticket_id}})
        const savedComment = await this._m_Comment.create({
            comment: comment,
            ticket: ticket,
            user: commentBy
        })
        return await this._m_Comment.save(savedComment)
    }
    async getComment({ticket_id, page = 1, perPage = 10}:{ticket_id:number, page:number, perPage:number}){
        const ticket = new Ticket()
        ticket.id = ticket_id;
        const skip = perPage * (page - 1)
        const comments =  await this._m_Comment.find({where: {ticket: ticket, parent: IsNull()},relations: ['comments'], skip, take: perPage});
        return comments;
    }
}