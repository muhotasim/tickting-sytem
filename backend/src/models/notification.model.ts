import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.model";
import { NotificationStatus, NotificationType } from "src/utils/custome.datatypes";
@Entity()
export class Notification{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({type: 'enum', enum: NotificationType, default: NotificationType.app})
    type: NotificationType

    @Column()
    message: string;

    @Column()
    timestamp: Date;
    
    @Column()
    link?:string

    @Column({type: 'enum', enum: NotificationStatus, default: NotificationStatus.unread})
    status: NotificationStatus;


    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;
}