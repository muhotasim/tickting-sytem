import { TicketPriority, TicketStatus } from "src/utils/custome.datatypes";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.model";
import { TicketAttachments } from "./ticket-attachment.model";
import { Comment } from "./comment.model";
@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    details: string;

    @Column({ type: 'enum', default: TicketPriority.low, enum: TicketPriority })
    priority: TicketPriority;

    @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.open })
    status: TicketStatus;

    @Column()
    submission_date: Date;

    @Column()
    resolved_date: Date;

    @ManyToOne(() => User, user => user.assigned_tickets)
    @JoinColumn({name: 'assigned_to'})
    assigned_to?: User;

    @Column()
    rating: number;

    @OneToMany(() => TicketAttachments, ticket => ticket.ticket)
    attachments: TicketAttachments[];


    @ManyToOne(() => User, user => user.tickets)
    @JoinColumn({name: 'submited_by'})
    submited_by?: User;


    @OneToMany(() => Comment, comment => comment.ticket)
    comments: Comment[];
    
    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}