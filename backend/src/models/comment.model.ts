import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
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


    @ManyToOne(()=>Comment, comment=>comment.comments)
    @JoinColumn({name: 'comment_id'})
    parent: Comment;

    @OneToMany(()=>Comment, comment=>comment.parent)
    comments: Comment[]
    
    @ManyToOne(()=>User, user=>user.comments)
    @JoinColumn({name: 'user_id'})
    user: User;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}