import { TicketPriority, TicketStatus } from "src/utils/custome.datatypes";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.model";
import { Ticket } from "./ticket.model";
@Entity()
export class TicketAttachments{
    @PrimaryGeneratedColumn()
    id: number;

    
    @Column()
    url: string

    @Column()
    file_name: string

    @Column()
    mime_type: string

    @ManyToOne(()=>Ticket, ticket=>ticket.attachments)
    @JoinColumn({name: 'ticket_id'})
    ticket: Ticket;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}