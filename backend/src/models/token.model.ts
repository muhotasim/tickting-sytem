import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class Token {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ type: 'text' })
    access_token: string;

    @Column({ type: 'text' })
    refresh_token: string;

    @ManyToOne(type => User, user => user.tokens,{onDelete: 'CASCADE'})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'bigint' })
    ac_token_expires_at: number;

    @Column({ type: 'bigint' })
    rf_token_expires_at: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}