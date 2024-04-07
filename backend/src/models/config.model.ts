import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.model";
import { Ticket } from "./ticket.model";
@Entity()
export class Config{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    app_name: string;

    @Column()
    logo: string;

    @Column()
    manage_tickets: string;
    
    @Column()
    support_tickets: string;
}