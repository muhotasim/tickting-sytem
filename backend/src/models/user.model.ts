import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToMany, JoinTable, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';
import { Role } from './role.model';
import { Token } from './token.model';
import { Notification } from './notification.model';
import { Ticket } from './ticket.model';
import { Comment } from './comment.model';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  is_superadmin: boolean

  @Column()
  password_reset_token: string

  @Column()
  password_token_expiry_at: Date
  
  @Column()
  is_active: boolean

  @ManyToMany((type) => Role, role => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @OneToMany(type => Token, token => token.user)
  tokens: Token[];

  @OneToMany(()=>Notification, notification=>notification.user)
  notifications: Notification[]

  @CreateDateColumn()
  created_at: Date;
  
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(()=>Ticket, ticket=>ticket.assigned_to)
  assigned_tickets?: Ticket[]

  
  @OneToMany(()=>Ticket, ticket=>ticket.submited_by)
  tickets?: Ticket[]
  
  @OneToMany(()=>Comment, comment=>comment.user)
  comments: Comment[]

}