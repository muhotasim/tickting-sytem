import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.model";
import { Ticket } from "./ticket.model";
@Entity()
export class Comment{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    comment: string;
    
    @ManyToOne(()=>Ticket, user=>user.comments)
    @JoinColumn({name: 'ticket_id'})
    ticket: Ticket;

    
    @ManyToOne(()=>User, user=>user.comments)
    @JoinColumn({name: 'user_id'})
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}